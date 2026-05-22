/**
 * Admin support API client.
 *
 * Thin fetch wrapper that ensures:
 *   - credentials: 'include'  (session cookie travels cross-origin)
 *   - X-Admin-Request: 1     (CSRF gate — required by backend middleware)
 *   - JSON in/out
 *
 * Throws on non-2xx with a parsed body for easy error display.
 */

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

class AdminApiError extends Error {
    constructor(status, body) {
        super(body?.error || `HTTP ${status}`);
        this.name = 'AdminApiError';
        this.status = status;
        this.body = body;
    }
}

async function request(path, options = {}) {
    if (!API_BASE) {
        throw new AdminApiError(0, {
            error: 'config_missing',
            message: 'REACT_APP_API_BASE_URL is not set',
        });
    }

    const res = await fetch(`${API_BASE}${path}`, {
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
