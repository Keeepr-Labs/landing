/**
 * Edge function: dynamic Open Graph for /invite link previews.
 *
 * Intercepts requests to /invite, reads c (convoId) and i (inviter userId)
 * from the URL, fetches the canonical group and inviter names from the
 * Keeep backend, and rewrites the og:title / og:description / twitter:*
 * meta tags in the served HTML before returning it. It also points
 * og:image / og:image:secure_url / twitter:image at the personalized card
 * rendered by the /og/invite function (netlify/functions/og-invite), with
 * a `v=` hash of the names so a rename gets a fresh URL past iMessage's
 * per-URL preview cache.
 *
 * Failure posture: every error path (missing c, malformed input, backend
 * timeout, backend {valid:false}, non-HTML response) falls back to the
 * unmodified static invite.html. Apple Messages never sees a broken
 * preview — worst case it sees the existing static card. The backend
 * endpoint enforces the same single-happy-path contract, and the image
 * function serves the static card whenever it can't render.
 */

import type { Context } from "https://edge.netlify.com";
import {
  buildDescription,
  buildImageAlt,
  buildOgImageUrl,
  buildTitle,
  fetchInvitePreview,
  imageOrigin,
  rewriteInviteMeta,
} from "../lib/invite-preview.mts";

const FETCH_TIMEOUT_MS = 1500;

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

  const data = await fetchInvitePreview(c, i, FETCH_TIMEOUT_MS);
  if (!data || !data.valid || !data.groupName) return;

  const title = buildTitle(data);
  const description = buildDescription(data);
  if (!title || !description) return;

  // Get the response Netlify would have served (the static invite.html).
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const html = rewriteInviteMeta(await response.text(), {
    title,
    description,
    imageUrl: buildOgImageUrl(imageOrigin(url), c, i, data),
    imageAlt: buildImageAlt(data),
  });

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
