import React, { useState } from "react";
import FriendDetails from "./FriendDetails";
import { startChatWithFriend, inviteUserToGroup } from './api';

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
                    <p>Group Members:</p>
                    <ul>
                        {selectedGroupChat.userIds.map((id, index) => (
                            <li key={index}>{id}</li>
                        ))}
                    </ul>

                    {/* Invite user input + button */}
                    <div style={{ marginTop: "1rem" }}>
                        <input
                            type="text"
                            placeholder="Enter username or email to invite"
                            value={inviteInput}
                            onChange={(e) => setInviteInput(e.target.value)}
                        />
                        <button onClick={handleInvite}>Invite</button>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default FourthContainer;
