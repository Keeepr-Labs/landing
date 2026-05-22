/**
 * UserContextSidebar — right-rail panel showing context about the user
 * in the currently selected support thread.
 *
 * Reads the active channel from useChatContext (Stream's chat-wide
 * context), derives the "other user" id from the channel's members,
 * and fetches GET /api/admin/support/user-context/:userId for the
 * sidebar payload. The backend caches for 60s; the client refetches
 * on every channel switch so the cache window keeps things fresh.
 *
 * Why context, not a prop:
 *   Stream-chat-react v14 drives channel selection through ChatContext.
 *   Reading it directly here means we don't have to thread state through
 *   Inbox.js, and selection updates trigger this component automatically.
 *
 * Empty/error states:
 *   - No active channel              → "Select a conversation"
 *   - User not in DB                 → 404 message + raw id for diagnosis
 *   - Backend unreachable / other    → error text
 *   - User has no active groups      → "(no active groups)" line
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useChatContext } from 'stream-chat-react';
import { api, AdminApiError } from './api';

const KEEEP_USER_ID = 'Keeep';

// Mirrors the values mobile uses for convo lifecycle state.
const STATE_LABELS = {
    paymentWindowOpen: 'Pledge window open',
    periodRunning: 'Period running',
    groupInactive: 'Inactive',
};

function formatGroupSize(memberCount) {
    if (memberCount == null) return null;
    if (memberCount === 2) return 'Partner';
    return `Group of ${memberCount}`;
}

function formatState(state) {
    if (!state) return null;
    return STATE_LABELS[state] || state;
}

function formatDate(raw) {
    if (!raw) return null;
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

export default function UserContextSidebar() {
    const { channel } = useChatContext();

    const otherUserId = useMemo(() => {
        const members = (channel && channel.state && channel.state.members) || {};
        return Object.keys(members).find((id) => id !== KEEEP_USER_ID) || null;
    }, [channel]);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!otherUserId) {
            setData(null);
            setError(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const result = await api.userContext(otherUserId);
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
    }, [otherUserId]);

    if (!otherUserId) {
        return (
            <aside className="admin-support-sidebar admin-support-sidebar-empty">
                <p>Select a conversation to see user context.</p>
            </aside>
        );
    }

    if (loading) {
        return (
            <aside className="admin-support-sidebar">
                <p>Loading…</p>
            </aside>
        );
    }

    if (error) {
        return (
            <aside className="admin-support-sidebar">
                <h3>User</h3>
                <p className="admin-support-sidebar-error">{error}</p>
                <p className="admin-support-sidebar-id"><code>{otherUserId}</code></p>
            </aside>
        );
    }

    if (!data) return null;

    const { user, groups, group_count } = data;

    return (
        <aside className="admin-support-sidebar">
            <section>
                <h3>{user.name || '(no name)'}</h3>
                <p className="admin-support-sidebar-id"><code>{user.id}</code></p>
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
                        {groups.map((g) => {
                            const sizeLabel = formatGroupSize(g.member_count);
                            const stateLabel = formatState(g.state);
                            const progressLabel =
                                g.workout_goal && g.workout_goal > 0
                                    ? `${g.shared_workouts ?? 0}/${g.workout_goal} workouts`
                                    : null;
                            return (
                                <li key={g.convo_id}>
                                    <strong>{g.name || '(unnamed)'}</strong>
                                    <div className="admin-support-sidebar-group-tags">
                                        {sizeLabel && (
                                            <span
                                                className={
                                                    g.member_count === 2
                                                        ? 'admin-support-tag admin-support-tag-partner'
                                                        : 'admin-support-tag'
                                                }
                                            >
                                                {sizeLabel}
                                            </span>
                                        )}
                                        {g.user_role === 'host' && (
                                            <span className="admin-support-tag admin-support-tag-host">
                                                Host
                                            </span>
                                        )}
                                        {stateLabel && (
                                            <span
                                                className={`admin-support-tag admin-support-tag-state admin-support-tag-state-${g.state}`}
                                            >
                                                {stateLabel}
                                            </span>
                                        )}
                                    </div>
                                    {(g.latest_round || progressLabel) && (
                                        <div className="admin-support-sidebar-group-meta">
                                            {g.latest_round && <span>Round {g.latest_round}</span>}
                                            {progressLabel && <span>{progressLabel}</span>}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </aside>
    );
}
