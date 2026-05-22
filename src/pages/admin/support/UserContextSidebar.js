/**
 * UserContextSidebar — right-rail panel showing context about the
 * user in the currently selected support thread.
 *
 * Fetches GET /api/admin/support/user-context/:userId whenever the
 * active user changes. Backend caches for 60s; client refetches on
 * every selection so cached payload is "fresh enough."
 *
 * Empty states:
 *   - No channel selected → "Select a conversation"
 *   - User lookup fails   → show error
 *   - User has no groups  → "(no active groups)"
 */

import React, { useEffect, useState } from 'react';
import { api, AdminApiError } from './api';

export default function UserContextSidebar({ userId }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setData(null);
            setError(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const result = await api.userContext(userId);
                if (!cancelled) setData(result);
            } catch (err) {
                if (cancelled) return;
                if (err instanceof AdminApiError && err.status === 404) {
                    setError('User not found in our database.');
                } else {
                    setError(err.message || 'Could not load user context.');
                }
                setData(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [userId]);

    if (!userId) {
        return (
            <aside className="admin-support-sidebar admin-support-sidebar-empty">
                <p>Select a conversation to see user context.</p>
            </aside>
        );
    }

    if (loading) {
        return (
            <aside className="admin-support-sidebar">
                <p>Loading user context…</p>
            </aside>
        );
    }

    if (error) {
        return (
            <aside className="admin-support-sidebar">
                <h3>User</h3>
                <p className="admin-support-sidebar-error">{error}</p>
                <p className="admin-support-sidebar-id"><code>{userId}</code></p>
            </aside>
        );
    }

    if (!data) return null;

    const { user, groups, group_count, support_channel_id } = data;

    return (
        <aside className="admin-support-sidebar">
            <section>
                <h3>{user.name || '(no name)'}</h3>
                <p className="admin-support-sidebar-id">
                    <code>{user.id}</code>
                </p>
                {user.email && (
                    <p className="admin-support-sidebar-row">
                        <span>Email</span>
                        <span>{user.email}</span>
                    </p>
                )}
                {user.created_at && (
                    <p className="admin-support-sidebar-row">
                        <span>Joined</span>
                        <span>{formatDate(user.created_at)}</span>
                    </p>
                )}
            </section>

            <section>
                <h4>Tickets</h4>
                <p className="admin-support-sidebar-row">
                    <span>Available</span>
                    <span>{user.available_tickets ?? '—'}</span>
                </p>
                <p className="admin-support-sidebar-row">
                    <span>Pledged</span>
                    <span>{user.pledged_tickets ?? '—'}</span>
                </p>
                <p className="admin-support-sidebar-row">
                    <span>Total</span>
                    <span>{user.total_tickets ?? '—'}</span>
                </p>
            </section>

            <section>
                <h4>Groups ({group_count})</h4>
                {groups.length === 0 ? (
                    <p className="admin-support-sidebar-empty-line">(no active groups)</p>
                ) : (
                    <ul className="admin-support-sidebar-groups">
                        {groups.map((g) => (
                            <li key={g.convo_id}>
                                <strong>{g.name || '(unnamed)'}</strong>
                                <div className="admin-support-sidebar-group-meta">
                                    {g.user_role === 'host' && <span>host</span>}
                                    {g.join_status && <span>{g.join_status}</span>}
                                    {g.latest_round && <span>round {g.latest_round}</span>}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h4>Support channel</h4>
                <p className="admin-support-sidebar-id">
                    <code>{support_channel_id}</code>
                </p>
            </section>
        </aside>
    );
}

function formatDate(raw) {
    try {
        const d = new Date(raw);
        if (Number.isNaN(d.getTime())) return raw;
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return raw;
    }
}
