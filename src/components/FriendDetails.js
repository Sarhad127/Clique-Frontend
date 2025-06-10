import React from "react";
import './styles/FriendDetails.css';
import {removeFriend} from "./api";

const FriendDetails = ({ friend, onStartChat, onFriendRemoved }) => {
    if (!friend) return null;

    const handleRemoveFriend = async () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
            alert("Not authenticated");
            return;
        }

        try {
            await removeFriend(friend.username || friend.email, token);
            if (onFriendRemoved) onFriendRemoved(friend.id);
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

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
            <button
                onClick={handleRemoveFriend}
                className="remove-friend-btn"
                style={{ marginTop: "10px", backgroundColor: "#e74c3c", color: "white", border: "none", padding: "8px", borderRadius: "5px" }}
            >
                Remove Friend
            </button>
        </div>
    );
};

export default FriendDetails;
