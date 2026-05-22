/**
 * Stream Chat client singleton for the admin support web app.
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │ Lifecycle                                                │
 *   │                                                          │
 *   │  getStreamClient() ──┬─▶ first call: connect as 'Keeep'  │
 *   │                      │   with token provider callback    │
 *   │                      │                                   │
 *   │                      └─▶ later calls: return cached      │
 *   │                                                          │
 *   │  disconnectStreamClient() ─▶ disconnect + clear cache    │
 *   │                              (used on logout/unmount)    │
 *   └──────────────────────────────────────────────────────────┘
 *
 * Token refresh is handled by passing api.me() as the token provider.
 * stream-chat-js calls it automatically when the current token nears
 * expiry — no manual refresh logic needed in the UI.
 */

import { StreamChat } from 'stream-chat';
import { api } from './api';

let client = null;
let connectPromise = null;

export async function getStreamClient() {
    if (client) return client;

    // Coalesce concurrent calls into one connect attempt
    if (connectPromise) return connectPromise;

    connectPromise = (async () => {
        const session = await api.me();
        const instance = StreamChat.getInstance(session.stream_api_key);

        await instance.connectUser(
            { id: session.stream_user_id, name: 'Keeep' },
            async () => {
                const refreshed = await api.me();
                return refreshed.stream_token;
            },
        );

        client = instance;
        connectPromise = null;
        return client;
    })().catch((error) => {
        connectPromise = null;
        throw error;
    });

    return connectPromise;
}

export async function disconnectStreamClient() {
    const c = client;
    client = null;
    connectPromise = null;
    if (c) {
        try {
            await c.disconnectUser();
        } catch {
            // Best effort — disconnect failures should not block logout
        }
    }
}
