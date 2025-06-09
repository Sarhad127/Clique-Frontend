import React, { useState } from "react";
import FriendDetails from "./FriendDetails";
import { startChatWithFriend, inviteUserToGroup, leaveGroup, addFriend } from './api';

const FourthContainer = ({
                             selectedFriends,
                             selectedGroupChat,
                             user,
                             chatList,
                             setChatList,
                             setServerSection,
                             setAllChatsTab,
                             setSelectedFriendId,
                             setActiveSection,
                             setSelectedFriend,
                             setActiveChatId,
                         }) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const [inviteInput, setInviteInput] = useState("");

    const handleInvite = async () => {
        if (!inviteInput.trim()) return;

        try {
            await inviteUserToGroup(selectedGroupChat.id, inviteInput.trim(), token);
            setInviteInput("");
        } catch (error) {
            console.error("Error inviting user:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            alert("Failed to invite user.");
        }
    };

    const handleLeaveGroup = async () => {
        if (!selectedGroupChat) return;

        const confirmed = window.confirm("Are you sure you want to leave the group?");
        if (!confirmed) return;

        try {
            await leaveGroup(selectedGroupChat.id, token);
            alert("You have left the group.");
            setSelectedFriend(null);
            setServerSection("allChats");
            setAllChatsTab("chat");
        } catch (error) {
            console.error("Failed to leave group:", error);
            alert("Failed to leave group.");
        }
    };

    const handleAddFriend = async (memberIdOrEmail) => {
        try {
            const message = await addFriend(memberIdOrEmail, token);
            alert(message || "Friend request sent.");
        } catch (error) {
            console.error("Error adding friend:", error);
            alert("Failed to add friend.");
        }
    };

    return (
        <div className="FOURTH-CONTAINER">
            {selectedFriends ? (
                <FriendDetails
                    friend={selectedFriends}
                    onStartChat={async (friendId) => {
                        const friend = user.friends.find((f) => f.id === friendId);
                        if (!friend) return;
                        try {
                            const chatData = await startChatWithFriend(friendId, token);
                            if (!chatList.some((chat) => chat.id === chatData.id)) {
                                setChatList((prev) => [
                                    ...prev,
                                    {
                                        id: chatData.id,
                                        username: friend.username,
                                        avatarUrl:
                                            friend.avatarUrl || `https://i.pravatar.cc/40?u=${friend.id}`,
                                        lastMessagePreview: chatData.lastMessage || "",
                                    },
                                ]);
                            }

                            setServerSection("allChats");
                            setAllChatsTab("chat");
                            setSelectedFriendId(friendId);
                            setActiveSection("chat");
                            setSelectedFriend(null);
                            setActiveChatId(friendId);
                        } catch (error) {
                            console.error("Error starting chat:", error);
                        }
                    }}
                />
            ) : selectedGroupChat ? (
                <div className="group-details">
                    <h3>{selectedGroupChat.title}</h3>
                    <p>Members</p>

                    <ul className="group-member-list">
                        {(selectedGroupChat.members && selectedGroupChat.members.length > 0) ? (
                            selectedGroupChat.members.map((member) => {
                                const isFriend = user.friends?.some(friend => friend.id === member.id);
                                const isCurrentUser = member.id === user.id;
                                return (
                                    <li key={member.id} className="group-member flex-align-center gap-8">
                                        <img
                                            src={member.avatarUrl || `https://i.pravatar.cc/40?u=${member.id}`}
                                            alt={member.username}
                                            className="group-member-avatar"
                                        />
                                        <span>{member.username}</span>
                                        {!isFriend && !isCurrentUser && (
                                            <button
                                                className="add-friend-button"
                                                onClick={() => handleAddFriend(member.username)}
                                            >
                                                Add as friend
                                            </button>
                                        )}
                                    </li>
                                );
                            })
                        ) : (
                            <li>No members found.</li>
                        )}
                    </ul>

                    <div className="invite-container">
                        <input
                            type="text"
                            placeholder="Enter email to invite"
                            value={inviteInput}
                            onChange={(e) => setInviteInput(e.target.value)}
                            className="invite-input"
                        />
                        <button onClick={handleInvite} className="invite-button">
                            Invite
                        </button>
                    </div>
                    <div className="leave-group-container" style={{ marginTop: "12px" }}>
                        <button
                            onClick={handleLeaveGroup}
                            className="leave-group-button"
                            style={{ backgroundColor: "#e74c3c", color: "white" }}
                        >
                            Leave Group
                        </button>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default FourthContainer;
