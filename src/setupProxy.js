/**
 * CRA dev-server proxy for the admin-support API → backend.
 *
 * Mirrors the production Netlify proxy (public/_redirects) so API calls
 * are same-origin in dev too and the admin session cookie stays
 * first-party. Scoped to /api/admin/support — the only prefix the admin
 * app calls — so the dev server never becomes a relay for the rest of
 * the backend API.
 *
 * The Origin header is stripped because the backend's admin CORS
 * allowlist only contains the production landing origins — without an
 * Origin header the backend treats the request like server-to-server
 * and allows it (same as production, where Netlify forwards the
 * allowlisted https://getkeeep.com origin).
 *
 * Target defaults to production (there is no staging backend today);
 * override with KEEEP_DEV_API_TARGET to point dev at a local backend.
 * Backend host also appears in public/_redirects and
 * netlify/edge-functions/invite.ts — change all three together.
 */

const { createProxyMiddleware } = require('http-proxy-middleware');

const TARGET =
    process.env.KEEEP_DEV_API_TARGET || 'https://keeep-9dde9ef1f49f.herokuapp.com';

module.exports = function (app) {
    // Make the prod default impossible to miss: replies sent from a dev
    // session reach REAL users. (No staging backend exists today.)
    console.warn(
        `\n[setupProxy] /api/admin/support → ${TARGET}` +
            (process.env.KEEEP_DEV_API_TARGET
                ? ' (KEEEP_DEV_API_TARGET override)'
                : ' ⚠ PRODUCTION backend — support replies reach real users. Set KEEEP_DEV_API_TARGET to use a local backend.') +
            '\n'
    );
    app.use(
        '/api/admin/support',
        createProxyMiddleware({
            target: TARGET,
            changeOrigin: true,
            onProxyReq: (proxyReq) => {
                proxyReq.removeHeader('origin');
            },
        })
    );
};
