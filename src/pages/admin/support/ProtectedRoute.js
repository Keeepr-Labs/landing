/**
 * ProtectedRoute — auth gate for the admin support routes.
 *
 * On mount, hits GET /api/admin/support/me to confirm the session
 * cookie is valid. Three outcomes:
 *
 *   - 200 → render children
 *   - 401 → redirect to /admin/support/login
 *   - other → show error message (config issue, backend down)
 *
 * The /me endpoint also returns a Stream token, so a successful check
 * doubles as the prerequisite for `getStreamClient()` later.
 */

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api, AdminApiError } from './api';

const STATE_CHECKING = 'checking';
const STATE_AUTHED = 'authed';
const STATE_UNAUTHED = 'unauthed';
const STATE_ERROR = 'error';

export default function ProtectedRoute({ children }) {
    const [state, setState] = useState(STATE_CHECKING);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                await api.me();
                if (!cancelled) setState(STATE_AUTHED);
            } catch (error) {
                if (cancelled) return;
                if (error instanceof AdminApiError && error.status === 401) {
                    setState(STATE_UNAUTHED);
                } else {
                    setErrorMessage(error.message || 'Unable to reach the support service.');
                    setState(STATE_ERROR);
                }
            }
        })();

        return () => { cancelled = true; };
    }, []);

    if (state === STATE_CHECKING) {
        return (
            <div className="admin-support-state-screen">
                <p>Checking session…</p>
            </div>
        );
    }

    if (state === STATE_UNAUTHED) {
        return <Navigate to="/admin/support/login" replace />;
    }

    if (state === STATE_ERROR) {
        return (
            <div className="admin-support-state-screen">
                <h2>Support is unavailable</h2>
                <p>{errorMessage}</p>
                <p className="admin-support-state-hint">
                    Check that the backend is up and that the <code>/api/*</code> proxy in{' '}
                    <code>public/_redirects</code> points at it.
                </p>
            </div>
        );
    }

    return children;
}
