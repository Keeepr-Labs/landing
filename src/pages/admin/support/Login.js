/**
 * Login — password-gated entry to the admin support inbox.
 *
 * One field, one submit. On success the backend sets a signed httpOnly
 * cookie (cross-site SameSite=None; Secure) and returns a Stream token
 * we won't use here (the Inbox calls /me again to get a fresh one).
 *
 * Error states surfaced to the user:
 *   - 401 invalid_password → "Wrong password"
 *   - 429 rate_limited     → "Too many attempts, try again later"
 *   - 0 / network          → "Could not reach the server"
 *   - other                → raw error code for diagnostics
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, AdminApiError } from './api';

export default function Login() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // If already authenticated, jump straight to the inbox
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                await api.me();
                if (!cancelled) navigate('/admin/support', { replace: true });
            } catch {
                // Not authed — stay on login
            }
        })();
        return () => { cancelled = true; };
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting || !password) return;

        setSubmitting(true);
        setError(null);

        try {
            await api.login(password);
            navigate('/admin/support', { replace: true });
        } catch (err) {
            if (err instanceof AdminApiError) {
                if (err.status === 401) {
                    setError('Wrong password.');
                } else if (err.status === 429) {
                    setError('Too many attempts. Try again in 15 minutes.');
                } else if (err.status === 0) {
                    setError('Could not reach the server.');
                } else {
                    setError(`Error: ${err.body?.error || err.message}`);
                }
            } else {
                setError(err.message || 'Something went wrong.');
            }
            setPassword('');
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-support-login">
            <div className="admin-support-login-card">
                <h1>Keeep support</h1>
                <p className="admin-support-login-sub">Sign in to read and reply to user questions.</p>
                <form onSubmit={handleSubmit}>
                    <div className="admin-support-password-field">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            autoFocus
                            autoComplete="current-password"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            disabled={submitting}
                        />
                        <button
                            type="button"
                            className="admin-support-password-toggle"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <button type="submit" disabled={submitting || !password}>
                        {submitting ? 'Signing in…' : 'Sign in'}
                    </button>
                    {error && <div className="admin-support-login-error">{error}</div>}
                </form>
            </div>
        </div>
    );
}
