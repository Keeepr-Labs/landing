/**
 * CRA dev-server proxy for /api/* → Heroku backend.
 *
 * Mirrors the production Netlify proxy (public/_redirects) so API calls
 * are same-origin in dev too and the admin session cookie stays
 * first-party.
 *
 * The Origin header is stripped because the backend's admin CORS
 * allowlist only contains the production landing origins — without an
 * Origin header the backend treats the request like server-to-server
 * and allows it (same as the Netlify proxy in production, where the
 * forwarded Origin is the allowlisted https://getkeeep.com).
 */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://keeep-9dde9ef1f49f.herokuapp.com',
            changeOrigin: true,
            onProxyReq: (proxyReq) => {
                proxyReq.removeHeader('origin');
            },
        })
    );
};
