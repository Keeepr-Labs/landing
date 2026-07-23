/**
 * Admin support API client.
 *
 * Requests are same-origin (`/api/admin/support/...`), never a direct
 * call to the Heroku hostname:
 *   - Production: Netlify proxies /api/admin/support/* to the backend
 *     (public/_redirects), so the session cookie is first-party.
 *     iOS/macOS Safari drop third-party cookies, which is why login
 *     silently failed on mobile when we hit the Heroku URL cross-origin.
 *   - Development: src/setupProxy.js forwards the same prefix.
 *
 * Thin fetch wrapper that ensures:
 *   - credentials: 'include'  (session cookie on every request)
 *   - X-Admin-Request: 1     (CSRF gate — required by backend middleware)
 *   - JSON in/out
 *
 * Throws AdminApiError on non-2xx (status + parsed body), on network
 * failure (status 0), and on a 2xx that isn't JSON — a 200 HTML page
 * means the SPA catch-all answered instead of the backend proxy, and
 * treating that as an authenticated session would fake-auth the UI.
 */

class AdminApiError extends Error {
    constructor(status, body) {
        super(body?.error || `HTTP ${status}`);
        this.name = 'AdminApiError';
        this.status = status;
        this.body = body;
    }
}

async function request(path, options = {}) {
    let res;
    try {
        res = await fetch(path, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Request': '1',
                ...(options.headers || {}),
            },
        });
    } catch {
        // fetch rejects on network failure — surface as status 0 so the
        // UI shows "Could not reach the server."
        throw new AdminApiError(0, { error: 'network_error' });
    }

    // 204 (logout) legitimately has no body
    if (res.ok && res.status === 204) {
        return null;
    }

    let body = null;
    try {
        body = await res.json();
    } catch {
        body = null;
    }

    if (!res.ok) {
        throw new AdminApiError(res.status, body);
    }
    if (body === null) {
        // 2xx without a JSON body: the /api proxy is misconfigured and the
        // SPA catch-all (or an empty response) answered. Never treat as success.
        throw new AdminApiError(0, { error: 'non_json_response' });
    }
    return body;
}

export const api = {
    login: (password) =>
        request('/api/admin/support/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
        }),
    logout: () =>
        request('/api/admin/support/logout', { method: 'POST' }),
    me: () => request('/api/admin/support/me'),
    userContext: (userId) =>
        request(`/api/admin/support/user-context/${encodeURIComponent(userId)}`),
};

export { AdminApiError };
