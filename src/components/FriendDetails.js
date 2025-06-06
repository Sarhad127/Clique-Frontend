import React from "react";

const FriendDetails = ({ friend, onStartChat }) => {
    if (!friend) return null;

    return (
        <div className="friend-details">
            <img
                src={friend.avatarUrl || `https://i.pravatar.cc/100?u=${friend.id}`}
                alt={friend.username || friend.email}
                className="friend-details-avatar"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.username || friend.email)}&background=random&size=100`;
                }}
                style={{ borderRadius: '50%', width: '100px', height: '100px' }}
            />
            <h3>{friend.username || "No username"}</h3>
            <p>{friend.email || "No email"}</p>

            {friend.description && (
                <p style={{ fontStyle: 'italic', marginTop: '8px' }}>
                    {friend.description}
                </p>
            )}

            <button
                onClick={() => onStartChat(friend.id)}
                style={{ marginTop: "10px", padding: "8px 16px", cursor: "pointer" }}
            >
                Start Chat
            </button>
        </div>
    );
};

export default FriendDetails;