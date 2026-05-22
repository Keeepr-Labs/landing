/**
 * Inbox — the main admin support surface.
 *
 *   ┌──────────────┬──────────────────────────────┬──────────────┐
 *   │ Channel list │  Active thread               │ User context │
 *   │              │                              │ sidebar      │
 *   │ (Stream      │ (Stream MessageList +        │ (Keeep-      │
 *   │  ChannelList)│  MessageInput from RN)       │  backend     │
 *   │              │                              │  enrichment) │
 *   │ Filter:      │                              │              │
 *   │ members $in  │                              │ Selected     │
 *   │ ['Keeep']    │                              │ user's       │
 *   │              │                              │ groups +     │
 *   │              │                              │ tickets +    │
 *   │              │                              │ join date    │
 *   └──────────────┴──────────────────────────────┴──────────────┘
 *
 * Channel selection logic: when a channel is selected, derive the
 * "other user" (any member that isn't 'Keeep') and pass their id
 * to the sidebar for enrichment.
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
import UserContextSidebar from './UserContextSidebar';

const KEEEP_USER_ID = 'Keeep';

// Stream channel list filter + sort, memoizable outside the component
const channelFilters = { type: 'messaging', members: { $in: [KEEEP_USER_ID] } };
const channelSort = { last_message_at: -1 };
const channelOptions = { limit: 30, state: true, watch: true, presence: false };

export default function Inbox() {
    const [client, setClient] = useState(null);
    const [error, setError] = useState(null);
    const [activeOtherUserId, setActiveOtherUserId] = useState(null);

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

    const onChannelSelect = useCallback((channel) => {
        // Pull the non-Keeep member id from the channel state
        const members = channel.state?.members || {};
        const otherId = Object.keys(members).find((id) => id !== KEEEP_USER_ID);
        setActiveOtherUserId(otherId || null);
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
                            customActiveChannel={undefined}
                            onSelect={onChannelSelect}
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
                </Chat>
                <UserContextSidebar userId={activeOtherUserId} />
            </div>
        </div>
    );
}
