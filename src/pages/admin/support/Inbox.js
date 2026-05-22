/**
 * Inbox — the main admin support surface.
 *
 *   ┌──────────────┬──────────────────────────────┬──────────────┐
 *   │ Channel list │  Active thread               │ User context │
 *   │              │                              │ sidebar      │
 *   │ Custom       │ (Stream Channel + Window +   │ (Keeep-      │
 *   │ Preview:     │  MessageList + Composer)     │  backend     │
 *   │ titles by    │                              │  enrichment) │
 *   │ user name    │                              │              │
 *   │ Filter:      │                              │ Reads active │
 *   │ members $in  │                              │ channel from │
 *   │ ['Keeep']    │                              │ chat context │
 *   └──────────────┴──────────────────────────────┴──────────────┘
 *
 * Channel selection is driven by Stream's ChatContext (not a parent-prop
 * callback). The sidebar reads the active channel from useChatContext
 * directly, so we don't have to thread state through Inbox.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
    Chat,
    ChannelList,
    Channel,
    Window,
    ChannelHeader,
    MessageList,
    MessageComposer,
    Thread,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

import { getStreamClient, disconnectStreamClient } from './streamClient';
import { api } from './api';
import SupportChannelPreview from './SupportChannelPreview';
import UserContextSidebar from './UserContextSidebar';

const KEEEP_USER_ID = 'Keeep';

// Stream channel list filter + sort, defined outside the component so the
// references stay stable across renders (Stream rebuilds the list on change).
const channelFilters = { type: 'messaging', members: { $in: [KEEEP_USER_ID] } };
const channelSort = { last_message_at: -1 };
const channelOptions = { limit: 30, state: true, watch: true, presence: false };

export default function Inbox() {
    const [client, setClient] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const c = await getStreamClient();
                if (!cancelled) setClient(c);
            } catch (err) {
                if (!cancelled) setError(err.message || 'Could not connect to chat.');
            }
        })();

        return () => {
            cancelled = true;
            disconnectStreamClient();
        };
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await api.logout();
        } catch {
            // Best effort — still proceed to disconnect/reload
        }
        await disconnectStreamClient();
        window.location.href = '/admin/support/login';
    }, []);

    if (error) {
        return (
            <div className="admin-support-state-screen">
                <h2>Could not connect to chat</h2>
                <p>{error}</p>
                <button onClick={handleLogout}>Sign out</button>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="admin-support-state-screen">
                <p>Connecting…</p>
            </div>
        );
    }

    return (
        <div className="admin-support-inbox str-chat__theme-light">
            <header className="admin-support-header">
                <strong>Keeep support</strong>
                <button
                    className="admin-support-header-logout"
                    onClick={handleLogout}
                    type="button"
                >
                    Sign out
                </button>
            </header>

            <div className="admin-support-inbox-body">
                <Chat client={client} theme="str-chat__theme-light">
                    <div className="admin-support-channel-list">
                        <ChannelList
                            filters={channelFilters}
                            sort={channelSort}
                            options={channelOptions}
                            Preview={SupportChannelPreview}
                        />
                    </div>
                    <div className="admin-support-channel-active">
                        <Channel>
                            <Window>
                                <ChannelHeader />
                                <MessageList />
                                <MessageComposer />
                            </Window>
                            <Thread />
                        </Channel>
                    </div>
                    <UserContextSidebar />
                </Chat>
            </div>
        </div>
    );
}
