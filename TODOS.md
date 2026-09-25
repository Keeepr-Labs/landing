# TODOS

## Invite link preview card (`/og/invite`)

### Draw emoji on the card
**Priority:** P3
Emoji are stripped from the card (Manrope has no glyphs; the text title keeps them), so "Book Club 📚" renders as "Book Club" and an emoji-only group name gets the static card. Satori's `loadAdditionalAsset` can supply emoji as SVG images (Twemoji is CC-BY 4.0 and needs attribution; Noto Emoji is Apache 2.0).
**Noticed:** invite card build (2026-09-25).

### Card for non-Latin names
**Priority:** P3
Names Manrope can't draw (CJK, Arabic, Hebrew, Thai…) get the static card rather than missing glyphs. If invites in those scripts matter, bundle a fallback font (e.g. Noto Sans subsets) and pass it to Satori.
**Noticed:** invite card build (2026-09-25).

### Rate-limit the image function
**Priority:** P3
Each uncached `/og/invite` URL costs one backend lookup plus a render, and random `c=` values are always uncached, the same exposure `/invite` already has. If abuse shows up, add `rateLimit` to the function's `config` (Netlify code-based rate limiting) with a rewrite to `/images/shareLink.png`.
**Noticed:** invite card build (2026-09-25).

### Remove the dead `/invite → /inviteLink.html` rule
**Priority:** P3
`public/invite.html` exists, so Netlify serves it at `/invite` and the non-forced `_redirects` rule never fires (the edge function rewrites invite.html's tags). Delete the rule, and `inviteLink.html` if nothing links to `/invitelink`, so nobody edits the wrong page.
**Noticed:** invite card build (2026-09-25).

## Admin support inbox (backend — Keeep-backend repo)

### Tighten admin session cookie to SameSite=Lax
**Priority:** P1
Now that all admin API calls are first-party (Netlify `/api/admin/support/*` proxy, PR #12), `SameSite=None` on the `keeep_admin_support` cookie is pure liability — a cross-site form POST attaches it. Change `cookieOptions()` in `api/admin/support/support-middleware.js` to `sameSite: 'lax'`, then update the stale docblock in `src/pages/admin/support/Login.js`.
**Noticed:** PR #12 review (security + adversarial, 2026-07-23).

### Verify login rate limiter keys on the real client IP
**Priority:** P1
Behind Netlify → Heroku the backend sees proxy IPs. If `adminSupportLoginLimiter` keys on the connection IP, all admins share one brute-force bucket (lockout DoS) and attackers rotate freely against the direct Heroku URL. Key on the leftmost trusted `X-Forwarded-For` hop and add per-account throttling.
**Noticed:** PR #12 review (security + adversarial, 2026-07-23).

### Cache-Control: no-store on admin support responses
**Priority:** P2
`/api/admin/support/me` returns Stream credentials and `/user-context/:id` returns PII; with a CDN/proxy hop in front, rely on explicit `Cache-Control: no-store, private` from the backend rather than absent headers.
**Noticed:** PR #12 Codex review (2026-07-23).

## Admin support inbox (frontend)

### Test harness for Inbox pane switching
**Priority:** P2
The phone single-pane navigation (has-active-channel class, back button, `setActiveChannelOnMount`) has no tests — needs a stream-chat-react mock harness (`useChatContext`, stub `Chat`/`ChannelList`/`Channel`).
**Noticed:** PR #12 testing specialist (2026-07-23).

### Collapse header bars on phone thread view
**Priority:** P3
With a thread open on a phone, three bars stack (app header, back button, Stream ChannelHeader) ≈150px of a ~660px viewport. Consider hiding the app header or folding back-navigation into ChannelHeader in the has-active-channel phone state. Verify visually first.
**Noticed:** PR #12 design review (2026-07-23).

### StrictMode double-mount race in streamClient singleton
**Priority:** P3
Pre-existing: Inbox unmount calls `disconnectStreamClient()` while `connectPromise` may be in flight; the resolved connect can resurrect a websocket nobody owns. Guard the singleton against connect/disconnect interleaving.
**Noticed:** PR #12 adversarial review (2026-07-23).

## Completed
