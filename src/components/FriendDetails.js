import React from "react";
import './styles/FriendDetails.css';

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
            />
            <h3>{friend.username || "No username"}</h3>
            <p>{friend.email || "No email"}</p>

            {friend.description && (
                <p className="description">
                    {friend.description}
                </p>
            )}

            <button
                onClick={() => onStartChat(friend.id)}
                className="start-chat-btn"
            >
                Start Chat
            </button>
        </div>
    );
};

export default FriendDetails;
