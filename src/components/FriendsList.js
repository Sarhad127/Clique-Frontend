import React, { useState } from "react";
import AddFriendContainer from "./AddFriendContainer";

const FriendsList = ({
                         user,
                         showAddFriend,
                         setShowAddFriend,
                         onFriendClick,
                     }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleFriendClick = (friendId) => {
        console.log("Friend clicked:", friendId);
        if (onFriendClick) {
            onFriendClick(friendId);
        } else {
            console.error("onFriendClick handler not provided");
        }
    };

    const filteredFriends = user?.friends?.filter((friend) => {
        const name = friend.username || friend.email || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="friends-list">
            <div className="friends-header">
                <h3 className="friends-title">Friends</h3>
                <button
                    className="add-friend-btn"
                    onClick={() => setShowAddFriend((prev) => !prev)}
                    aria-label="Add Friend"
                    type="button"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="white"
                        viewBox="0 0 24 24"
                        style={{ marginRight: 8, verticalAlign: "middle" }}
                        aria-hidden="true"
                    >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                        <path d="M6 20v-2c0-2 4-3 6-3s6 1 6 3v2H6z" />
                        <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3z" />
                    </svg>
                    Add Friend
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="friend-search-input"
                />
            </div>
            <hr/>
            <div className="friends-container">
                {showAddFriend && <AddFriendContainer token={localStorage.getItem("token")} />}
                <ul>
                    {filteredFriends?.length > 0 ? (
                        filteredFriends.map((friend) => (
                            <li
                                key={friend.id}
                                className="friend-item"
                                onClick={() => handleFriendClick(friend.id)}
                            >
                                <img
                                    src={friend.avatarUrl || `https://i.pravatar.cc/40?u=${friend.id}`}
                                    alt={friend.username || friend.email || "Friend"}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            friend.username || friend.email
                                        )}&background=random&size=40`;
                                    }}
                                />
                                <span>{friend.username || friend.email}</span>
                            </li>
                        ))
                    ) : (
                        <li></li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default FriendsList;
