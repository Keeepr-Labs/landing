/**
 * Edge function: dynamic Open Graph for /invite link previews.
 *
 * Intercepts requests to /invite, reads c (convoId) and i (inviter userId)
 * from the URL, fetches the canonical group and inviter names from the
 * Keeep backend, and rewrites the og:title / og:description / twitter:*
 * meta tags in the served HTML before returning it. The image stays
 * static at /images/shareLink.png — image generation is intentionally
 * out of scope for this iteration (see
 * Keeep-app/Keeep-mobile/docs/landing-page-invite-dynamic-og-handoff.md).
 *
 * Failure posture: every error path (missing c, malformed input, backend
 * timeout, backend {valid:false}, non-HTML response) falls back to the
 * unmodified static invite.html. Apple Messages never sees a broken
 * preview — worst case it sees the existing static card. The backend
 * endpoint enforces the same single-happy-path contract.
 */

import type { Context } from "https://edge.netlify.com";

const BACKEND_URL =
  "https://keeep-9dde9ef1f49f.herokuapp.com/api/public/invite-preview";
const FETCH_TIMEOUT_MS = 1500;

// Output clamps. The backend also clamps server-side, so these are
// belt-and-suspenders for unexpected input.
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

interface PreviewResponse {
  valid: boolean;
  groupName?: string;
  inviterFirstName?: string | null;
}

/**
 * HTML-attribute-safe escape. The dynamic strings land inside
 * <meta content="..."> attributes; escaping " and & is sufficient there,
 * but we also escape < > ' defensively against future template moves.
 */
const escapeHtml = (s: string): string =>
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
const buildTitle = (data: PreviewResponse): string | null => {
  if (!data.groupName) return null;
  if (data.inviterFirstName) {
    return clamp(
      `${data.inviterFirstName} invited you to join ${data.groupName}`,
      TITLE_MAX,
    );
  }
  return clamp(`You're invited to join ${data.groupName}`, TITLE_MAX);
};

// Description is the brand's stated reason for existing. Same across every
// branch — the personalization signal lives in the title, the value prop
// lives here.
const buildDescription = (_data: PreviewResponse): string | null =>
  clamp(
    `Make it easier to stick to your workout goals, whatever they are`,
    DESCRIPTION_MAX,
  );

/**
 * Fetch preview data from the backend with a hard timeout. Returns null
 * on any failure — caller treats null as "pass through to static page."
 */
const fetchPreview = async (
  c: string,
  i: string | null,
): Promise<PreviewResponse | null> => {
  const url = new URL(BACKEND_URL);
  url.searchParams.set("c", c);
  if (i) url.searchParams.set("i", i);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) return null;
    const body = (await res.json()) as PreviewResponse;
    return body && typeof body.valid === "boolean" ? body : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Replace the content value of a <meta> tag identified by its
 * property|name attribute and key. Handles both attribute orderings
 * (property|name first, content first) because HTML5 allows either.
 * Replaces every occurrence in the document.
 */
const replaceMetaContent = (
  html: string,
  attr: "property" | "name",
  key: string,
  value: string,
): string => {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // property|name first, content second
  const re1 = new RegExp(
    `(<meta\\s+${attr}=["']${escapedKey}["']\\s+content=["'])([^"']*)(["'])`,
    "gi",
  );
  // content first, property|name second
  const re2 = new RegExp(
    `(<meta\\s+content=["'])([^"']*)(["']\\s+${attr}=["']${escapedKey}["'])`,
    "gi",
  );
  return html.replace(re1, `$1${value}$3`).replace(re2, `$1${value}$3`);
};

export default async (
  request: Request,
  context: Context,
): Promise<Response | undefined> => {
  const url = new URL(request.url);
  const c = url.searchParams.get("c");
  const i = url.searchParams.get("i");

  // Missing convoId → pass through to the static invite.html. Netlify
  // serves the unmodified file; the user still gets a valid preview.
  if (!c) return;

  const data = await fetchPreview(c, i);
  if (!data || !data.valid || !data.groupName) return;

  const title = buildTitle(data);
  const description = buildDescription(data);
  if (!title || !description) return;

  const titleEscaped = escapeHtml(title);
  const descriptionEscaped = escapeHtml(description);

  // Get the response Netlify would have served (the static invite.html).
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();
  html = replaceMetaContent(html, "property", "og:title", titleEscaped);
  html = replaceMetaContent(
    html,
    "property",
    "og:description",
    descriptionEscaped,
  );
  html = replaceMetaContent(html, "name", "twitter:title", titleEscaped);
  html = replaceMetaContent(
    html,
    "name",
    "twitter:description",
    descriptionEscaped,
  );

  // Preserve original response status; rewrite only the body and the
  // headers that change because of the modification. Short s-maxage so
  // the CDN refreshes within minutes if group metadata changes.
  return new Response(html, {
    status: response.status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, s-maxage=300, max-age=60",
    },
  });
};

export const config = {
  path: "/invite",
};
