/**
 * Admin support API client.
 *
 * Requests are same-origin (`/api/...`), never a direct call to the
 * Heroku hostname:
 *   - Production: Netlify proxies /api/* to the backend (public/_redirects),
 *     so the session cookie is first-party. iOS/macOS Safari drop
 *     third-party cookies, which is why login silently failed on mobile
 *     when we hit the Heroku URL cross-origin.
 *   - Development: CRA's dev-server proxy (package.json "proxy") forwards
 *     /api/* the same way.
 *
 * Thin fetch wrapper that ensures:
 *   - credentials: 'include'  (session cookie on every request)
 *   - X-Admin-Request: 1     (CSRF gate — required by backend middleware)
 *   - JSON in/out
 *
 * Throws on non-2xx with a parsed body for easy error display.
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
    const res = await fetch(path, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-Admin-Request': '1',
            ...(options.headers || {}),
        },
    });

    let body = null;
    try {
        body = await res.json();
    } catch {
        body = null;
    }

    if (!res.ok) {
        throw new AdminApiError(res.status, body);
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
