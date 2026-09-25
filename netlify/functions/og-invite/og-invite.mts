/**
 * Netlify Function: personalized invite preview image.
 *
 *   GET /og/invite?c=<convoId>&i=<inviterUserId>&v=<version>
 *
 * The /invite edge function points og:image here. This looks the names up
 * again from the backend (never from the URL: the `g` link param and any
 * name param are attacker-controlled) and draws "{First} invited you to
 * join {Group}" on the brand card.
 *
 * A Node function rather than an edge function because Satori + resvg can
 * exceed the edge CPU budget (~50 ms).
 *
 * Always answers with an image: every failure (bad params, backend
 * timeout or {valid:false}, unrenderable text, render error) serves the
 * static /images/shareLink.png card with a short cache, so a later request
 * can still get the personalized card.
 */

import {
  fetchInvitePreview,
  isConvoId,
  normalizeInviterId,
  previewVersion,
} from "../../lib/invite-preview.mts";
import { ASSETS, readAsset, renderInviteCard } from "./render-card.mts";

// Longer than the edge function's 1.5 s: link unfurlers wait several
// seconds for an image, and a miss here costs the whole personalized card.
const FETCH_TIMEOUT_MS = 3000;

const ONE_YEAR = 60 * 60 * 24 * 365;
const STALE_VERSION_MAX_AGE = 300;
const FALLBACK_MAX_AGE = 60;

const imageResponse = (
  body: Uint8Array,
  maxAge: number,
  immutable = false,
): Response => {
  const directives = `public, max-age=${maxAge}${immutable ? ", immutable" : ""}`;
  return new Response(body, {
    headers: {
      "content-type": "image/png",
      "cache-control": directives,
      "netlify-cdn-cache-control": `${directives}, durable`,
      // Cache on the params that change the image; ignore tracking junk.
      "netlify-vary": "query=c|i|v",
    },
  });
};

let fallbackCard: Buffer | undefined;

const fallback = (req: Request, reason: string): Response => {
  console.log(`og-invite: serving static card (${reason})`);
  try {
    fallbackCard ??= readAsset(ASSETS.fallbackCard);
    return imageResponse(fallbackCard, FALLBACK_MAX_AGE);
  } catch {
    // Last resort: the CDN copy of the same card.
    return new Response(null, {
      status: 302,
      headers: {
        location: new URL("/images/shareLink.png", req.url).toString(),
        "cache-control": `public, max-age=${FALLBACK_MAX_AGE}`,
      },
    });
  }
};

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const c = url.searchParams.get("c");
  if (!isConvoId(c)) return fallback(req, "bad params");

  try {
    const data = await fetchInvitePreview(
      c,
      normalizeInviterId(url.searchParams.get("i")),
      FETCH_TIMEOUT_MS,
    );
    if (!data) return fallback(req, "lookup failed");
    if (!data.valid || !data.groupName) return fallback(req, "no group");

    const png = await renderInviteCard({
      groupName: data.groupName,
      inviterFirstName: data.inviterFirstName ?? null,
    });
    if (!png) return fallback(req, "names not renderable");

    // A matching v means this URL always shows these names: cache for a
    // year. A stale or missing v (renamed since the page was built) still
    // gets the current names, briefly.
    return url.searchParams.get("v") === previewVersion(data)
      ? imageResponse(png, ONE_YEAR, true)
      : imageResponse(png, STALE_VERSION_MAX_AGE);
  } catch (error) {
    console.error("og-invite: render failed", error);
    return fallback(req, "render error");
  }
};

export const config = {
  path: "/og/invite",
};
