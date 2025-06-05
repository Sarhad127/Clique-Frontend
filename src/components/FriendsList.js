import React from "react";
import AddFriendContainer from "./AddFriendContainer";

const FriendsList = ({
                         user,
                         showAddFriend,
                         setShowAddFriend,
                         onFriendClick
                     }) => {
    const handleFriendClick = (friendId) => {
        console.log("Friend clicked:", friendId);
        if (onFriendClick) {
            onFriendClick(friendId);
        } else {
            console.error("onFriendClick handler not provided");
        }
    };

    return (
        <div className="friends-list">
            <div className="friends-header">
                <h3 className="friends-title">Friends</h3>
                <button
                    className="add-friend-btn"
                    onClick={() => setShowAddFriend((prev) => !prev)}
                    aria-label="Add Friend"
                >
                    +
                </button>
            </div>
            <div className="friends-container">
                {showAddFriend && <AddFriendContainer token={localStorage.getItem("token")} />}
                <ul>
                    {user?.friends?.length > 0 ? (
                        user.friends.map((friend) => (
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
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.username || friend.email)}&background=random&size=40`;
                                    }}
                                />
                                <span>{friend.username || friend.email}</span>
                            </li>
                        ))
                    ) : (
                        <li>No friends available</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default FriendsList;