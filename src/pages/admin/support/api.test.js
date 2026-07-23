import { api, AdminApiError } from './api';

describe('admin api client', () => {
    const jsonResponse = (status, body) => ({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(body),
    });
    const htmlResponse = (status) => ({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.reject(new SyntaxError('Unexpected token <')),
    });

    beforeEach(() => {
        global.fetch = jest.fn();
    });
    afterEach(() => {
        delete global.fetch;
    });

    test('sends same-origin path, credentials and the CSRF header', async () => {
        fetch.mockResolvedValue(jsonResponse(200, { ok: true }));
        await api.me();
        expect(fetch).toHaveBeenCalledWith(
            '/api/admin/support/me',
            expect.objectContaining({
                credentials: 'include',
                headers: expect.objectContaining({ 'X-Admin-Request': '1' }),
            })
        );
    });

    test('non-2xx rejects with AdminApiError carrying status and body', async () => {
        fetch.mockResolvedValue(jsonResponse(401, { error: 'invalid_password' }));
        await expect(api.login('bad')).rejects.toMatchObject({
            name: 'AdminApiError',
            status: 401,
            body: { error: 'invalid_password' },
        });
    });

    test('network failure rejects with status 0', async () => {
        fetch.mockRejectedValue(new TypeError('Failed to fetch'));
        await expect(api.me()).rejects.toMatchObject({ status: 0 });
    });

    test('a 200 HTML page (SPA catch-all shadowing the proxy) is NOT success', async () => {
        fetch.mockResolvedValue(htmlResponse(200));
        await expect(api.me()).rejects.toMatchObject({
            status: 0,
            body: { error: 'non_json_response' },
        });
    });

    test('204 from logout resolves without a body', async () => {
        fetch.mockResolvedValue({
            ok: true,
            status: 204,
            json: () => Promise.reject(new SyntaxError('no body')),
        });
        await expect(api.logout()).resolves.toBeNull();
    });

    test('AdminApiError message falls back to HTTP status', () => {
        expect(new AdminApiError(500, null).message).toBe('HTTP 500');
        expect(new AdminApiError(401, { error: 'nope' }).message).toBe('nope');
    });
});
