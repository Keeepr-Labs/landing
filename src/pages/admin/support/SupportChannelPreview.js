/**
 * SupportChannelPreview — custom row in the admin ChannelList.
 *
 * Every support channel in this view has the same channel name
 * ("Questions and Support 💬") because mobile's createSupportChat hardcodes
 * it. That's useful for the user (they see "support" in their channel list)
 * but useless for the admin (every row reads the same). Instead we display
 * the OTHER member's display name as the title.
 *
 * Identity resolution:
 *   1. The non-'Keeep' member's `user.name` from channel.state.members
 *      (populated by Stream when the user connects via connectUser)
 *   2. Fallback: the raw user_id, so a missing display name is at least
 *      diagnosable. If you find yourself routinely seeing IDs as titles,
 *      that's a signal to backfill names into Stream, not to add a
 *      per-channel backend lookup (N+1 risk on the inbox).
 *
 * Stream's ChannelList passes us:
 *   - channel:           the Stream channel object
 *   - setActiveChannel:  callback to switch the active channel on click
 *   - latestMessage:     last-message preview text (already formatted)
 *   - unread:            unread count for this channel
 *   - active:            whether this is the currently-selected channel
 */

import React from 'react';

const KEEEP_USER_ID = 'Keeep';

function deriveTitle(channel) {
    const members = (channel && channel.state && channel.state.members) || {};
    const otherId = Object.keys(members).find((id) => id !== KEEEP_USER_ID);
    if (!otherId) return 'Unknown';
    const otherUser = members[otherId] && members[otherId].user;
    return (otherUser && otherUser.name) || otherId;
}

function SupportChannelPreviewBase({
    channel,
    setActiveChannel,
    latestMessage,
    unread,
    active,
}) {
    const title = deriveTitle(channel);
    const handleClick = () => {
        if (typeof setActiveChannel === 'function') setActiveChannel(channel);
    };

    return (
        <button
            type="button"
            className={`admin-support-preview ${active ? 'is-active' : ''}`}
            onClick={handleClick}
        >
            <div className="admin-support-preview-row">
                <span className="admin-support-preview-title">{title}</span>
                {unread > 0 && (
                    <span className="admin-support-preview-unread">{unread}</span>
                )}
            </div>
            <div className="admin-support-preview-message">
                {latestMessage || 'No messages yet'}
            </div>
        </button>
    );
}

const SupportChannelPreview = React.memo(SupportChannelPreviewBase);
SupportChannelPreview.displayName = 'SupportChannelPreview';

export default SupportChannelPreview;
