/**
 * Shared invite-preview logic for the /invite edge function (Deno) and the
 * /og/invite image function (Node). Runtime-neutral on purpose: no Deno,
 * Node or Netlify imports, so both bundlers and `node --test` can load it.
 *
 * The preview endpoint lives in Keeep-backend (api/public/public-router.js)
 * and always answers HTTP 200 with either
 *   { valid: true, groupName, inviterFirstName, nextPayDate? }
 *   { valid: false }
 * inviterFirstName may be null; nextPayDate ('YYYY-MM-DD', the last day to
 * join) arrives with the v2 backend and is optional here.
 */

export const INVITE_PREVIEW_API_URL =
  "https://keeep-9dde9ef1f49f.herokuapp.com/api/public/invite-preview";

// Path of the preview image function (netlify/functions/og-invite).
export const OG_IMAGE_PATH = "/og/invite";

// Bump when the card design changes: it is part of the `v=` hash, so every
// invite gets a new image URL and iMessage refetches instead of reusing
// its per-URL cache of the old design.
export const OG_IMAGE_DESIGN_VERSION = "2";

// Output clamps. The backend also clamps server-side, so these are
// belt-and-suspenders for unexpected input.
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

// Mirrors of the backend validators: anything else can't match a row, so
// there is no point sending it (or putting it in an image URL).
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const USER_ID_RE = /^[A-Za-z0-9_-]{6,64}$/;

export interface InvitePreview {
  valid: boolean;
  groupName?: string;
  inviterFirstName?: string | null;
  nextPayDate?: string | null;
}

export const isConvoId = (c: string | null): c is string =>
  typeof c === "string" && UUID_RE.test(c);

export const normalizeInviterId = (i: string | null): string | null =>
  typeof i === "string" && USER_ID_RE.test(i) ? i : null;

/**
 * API URL, overridable with INVITE_PREVIEW_API_URL for local testing
 * against a mock or local backend. Never set in production.
 */
export const inviteApiUrl = (): string => {
  const g = globalThis as {
    Netlify?: { env?: { get(key: string): string | undefined } };
    process?: { env?: Record<string, string | undefined> };
  };
  let override: string | undefined;
  try {
    // Netlify's global on the platform and under `netlify dev`; plain
    // process.env under `node --test`.
    override = g.Netlify
      ? g.Netlify.env?.get("INVITE_PREVIEW_API_URL")
      : g.process?.env?.INVITE_PREVIEW_API_URL;
  } catch {
    // Deno throws on env reads without permission: use production.
  }
  return override && /^https?:\/\//.test(override)
    ? override
    : INVITE_PREVIEW_API_URL;
};

/**
 * Fetch preview data from the backend with a hard timeout. Never throws:
 * returns null on any failure — callers treat null as "no personalization".
 */
export const fetchInvitePreview = async (
  c: string,
  i: string | null,
  timeoutMs: number,
): Promise<InvitePreview | null> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = new URL(inviteApiUrl());
    url.searchParams.set("c", c);
    if (i) url.searchParams.set("i", i);
    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) return null;
    const body = (await res.json()) as InvitePreview;
    return body && typeof body.valid === "boolean" ? body : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

/**
 * HTML-attribute-safe escape. The dynamic strings land inside
 * <meta content="..."> attributes; escaping " and & is sufficient there,
 * but we also escape < > ' defensively against future template moves.
 */
export const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const clamp = (s: string, max: number): string =>
  s.length <= max ? s : s.slice(0, max - 1) + "…";

// Title leans into the social signal — the inviter and the group, in that
// order. When the inviter is unknown (e.g., URL missing `i=` or the lookup
// failed gracefully), fall back to a passive but still personal framing
// that keeps the "invitation" word doing the emotional work.
//
// The group name is wrapped in hyphens so it reads as a distinct entity
// regardless of how the user capitalized it. Without the brackets, a name
// like "link test" can blend into the surrounding sentence and lose its
// identity ("Fernando invited you to join link test" → which words are
// the group?).
export const buildTitle = (data: InvitePreview): string | null => {
  if (!data.groupName) return null;
  const wrappedGroup = `-${data.groupName}-`;
  if (data.inviterFirstName) {
    return clamp(
      `${data.inviterFirstName} invited you to join ${wrappedGroup}`,
      TITLE_MAX,
    );
  }
  return clamp(`You're invited to join ${wrappedGroup}`, TITLE_MAX);
};

// Description is the brand's stated reason for existing. Same across every
// branch — the personalization signal lives in the title, the value prop
// lives here.
export const buildDescription = (_data: InvitePreview): string | null =>
  clamp(
    `Make it easier to stick to your workout goals, whatever they are`,
    DESCRIPTION_MAX,
  );

// Alt text says what the generated card shows.
export const buildImageAlt = (
  data: InvitePreview,
  now: Date = new Date(),
): string => {
  const invite = data.inviterFirstName
    ? `${data.inviterFirstName} invited you to join ${data.groupName} on Keeep`
    : `You're invited to join ${data.groupName} on Keeep`;
  const badge = joinByLabel(data.nextPayDate, now);
  return badge ? `${invite}. ${badge}.` : invite;
};

/**
 * 64-bit FNV-1a over the UTF-8 bytes, base36. Not a security hash: `v=`
 * is only a cache key that must change when the rendered names change.
 */
const fnv1a64 = (input: string): string => {
  let hash = 0xcbf29ce484222325n;
  for (const byte of new TextEncoder().encode(input)) {
    hash ^= BigInt(byte);
    hash = (hash * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return hash.toString(36);
};

// 'YYYY-MM-DD', optionally followed by an ISO time.
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})(?:T[\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?$/;
const joinByFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/**
 * "Join by Fri, Oct 3" while the join window is open, else null.
 *
 * A date, never a countdown: iMessage bakes the preview into the bubble at
 * send time, so "2 days left" would go stale in the chat. nextPayDate is
 * the last day to join, as the app's countdown shows it (end of that day)
 * and as the invite inbox expires it (nextPayDate < today).
 */
export const joinByLabel = (
  nextPayDate: string | null | undefined,
  now: Date = new Date(),
): string | null => {
  const m = typeof nextPayDate === "string" ? DATE_RE.exec(nextPayDate) : null;
  if (!m) return null;
  const [year, month, day] = [Number(m[1]), Number(m[2]) - 1, Number(m[3])];
  const deadline = Date.UTC(year, month, day);
  // Date.UTC rolls 2026-13-45 over into 2027; only a real date may show.
  const check = new Date(deadline);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month ||
    check.getUTCDate() !== day
  ) {
    return null;
  }
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  if (deadline < today) return null;
  return `Join by ${joinByFormat.format(deadline)}`;
};

/**
 * Cache-busting version of the card: design version + everything drawn on
 * it (names and the join-by badge, which disappears once the window closes).
 */
export const previewVersion = (
  data: InvitePreview,
  now: Date = new Date(),
): string =>
  fnv1a64(
    [
      OG_IMAGE_DESIGN_VERSION,
      data.groupName ?? "",
      data.inviterFirstName ?? "",
      joinByLabel(data.nextPayDate, now) ?? "",
    ].join("\u0000"),
  );

/**
 * Origin for absolute og:image URLs. Link unfurlers need https; plain
 * http is only kept for local `netlify dev`.
 */
export const imageOrigin = (requestUrl: URL): string => {
  const local = ["localhost", "127.0.0.1"].includes(requestUrl.hostname);
  return local ? requestUrl.origin : `https://${requestUrl.host}`;
};

/**
 * Absolute URL of the personalized preview image. Carries only the IDs and
 * the version hash — never the names — so the image function renders from
 * its own backend lookup and a crafted URL can't put arbitrary text on a
 * getkeeep.com image.
 */
export const buildOgImageUrl = (
  origin: string,
  c: string,
  i: string | null,
  data: InvitePreview,
  now: Date = new Date(),
): string => {
  const url = new URL(OG_IMAGE_PATH, origin);
  url.searchParams.set("c", c.toLowerCase());
  const inviterId = normalizeInviterId(i);
  if (inviterId) url.searchParams.set("i", inviterId);
  url.searchParams.set("v", previewVersion(data, now));
  return url.toString();
};

/**
 * Replace the content value of a <meta> tag identified by its
 * property|name attribute and key. Handles both attribute orderings
 * (property|name first, content first) because HTML5 allows either.
 * Replaces every occurrence in the document.
 */
export const replaceMetaContent = (
  html: string,
  attr: "property" | "name",
  key: string,
  value: string,
): string => {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Lock the regex to double-quoted attribute boundaries. invite.html
  // uses double quotes consistently, and matching on `["']` would treat
  // apostrophes inside content (e.g., "You're invited...") as a closing
  // boundary, causing partial replacement. The content class `[^"]*`
  // correctly leaves apostrophes alone.
  // property|name first, content second
  const re1 = new RegExp(
    `(<meta\\s+${attr}="${escapedKey}"\\s+content=")[^"]*(")`,
    "gi",
  );
  // content first, property|name second
  const re2 = new RegExp(
    `(<meta\\s+content=")[^"]*("\\s+${attr}="${escapedKey}")`,
    "gi",
  );
  // Function replacements: a `$` in a group name must stay literal.
  return html
    .replace(re1, (_m, open, close) => `${open}${value}${close}`)
    .replace(re2, (_m, open, close) => `${open}${value}${close}`);
};

export interface InviteMeta {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

/** Rewrite the personalized tags of the static invite.html. Escapes values. */
export const rewriteInviteMeta = (html: string, meta: InviteMeta): string => {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const imageUrl = escapeHtml(meta.imageUrl);
  let out = html;
  out = replaceMetaContent(out, "property", "og:title", title);
  out = replaceMetaContent(out, "property", "og:description", description);
  out = replaceMetaContent(out, "name", "twitter:title", title);
  out = replaceMetaContent(out, "name", "twitter:description", description);
  out = replaceMetaContent(out, "property", "og:image", imageUrl);
  out = replaceMetaContent(out, "property", "og:image:secure_url", imageUrl);
  out = replaceMetaContent(out, "name", "twitter:image", imageUrl);
  out = replaceMetaContent(
    out,
    "property",
    "og:image:alt",
    escapeHtml(meta.imageAlt),
  );
  return out;
};
