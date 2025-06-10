import React, {useEffect, useState} from "react";
import FriendDetails from "./FriendDetails";
import {
    startChatWithFriend,
    inviteUserToGroup,
    leaveGroup,
    addFriend,
    updateGroupBackgroundImage,
    deleteChat
} from './api';
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";

const FourthContainer = ({
                             selectedFriends,
                             selectedGroupChat,
                             setSelectedGroupChat,
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
    const [backgroundUrlInput, setBackgroundUrlInput] = useState("");

    useEffect(() => {
        if (!selectedGroupChat?.id) return;

        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            const groupId = selectedGroupChat.id;

            stompClient.subscribe(`/topic/group-background/${groupId}`, (message) => {
                const body = JSON.parse(message.body);
                setSelectedGroupChat((prev) => ({
                    ...prev,
                    backgroundImageUrl: body.backgroundImageUrl,
                }));
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, [selectedGroupChat?.id]);

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

    const handleUpdateBackground = async () => {
        if (!backgroundUrlInput.trim()) return;

        try {
            await updateGroupBackgroundImage(selectedGroupChat.id, backgroundUrlInput.trim(), token);

            setSelectedGroupChat(prev => ({
                ...prev,
                backgroundImageUrl: backgroundUrlInput.trim(),
            }));
            setBackgroundUrlInput("");
        } catch (error) {
            console.error("Error updating background:", error);
        }
    };

    const handleDeleteChat = async (chatId, token) => {
        try {
            await deleteChat(chatId, token);
            setChatList((prev) => prev.filter(chat => chat.id !== chatId));
        } catch (error) {
            console.error("Failed to delete chat:", error);
            alert("Failed to delete chat.");
        }
    };

    return (
        <div className="FOURTH-CONTAINER">
            {selectedFriends ? (
                <FriendDetails
                    friend={selectedFriends}
                    chatList={chatList}
                    onDeleteChat={handleDeleteChat}
                    onStartChat={async (friendId) => {
                        const friend = user?.friends?.find((f) => f.id === friendId);
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
                                const isFriend = Array.isArray(user?.friends) && user.friends.some(friend => friend.id === member.id);
                                const isCurrentUser = member.id === user?.id;
                                return (
                                    <li key={member.id} className="group-member flex-align-center gap-8">
                                        {member.avatarUrl ? (
                                            <img
                                                src={member.avatarUrl}
                                                alt={member.username}
                                                className="group-member-avatar"
                                            />
                                        ) : (
                                            <div
                                                className="group-member-avatar"
                                                style={{
                                                    backgroundColor: member.avatarColor || '#ccc',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: '#000',
                                                    fontWeight: 'bold',
                                                    fontSize: '16px',
                                                    userSelect: 'none',
                                                }}
                                                title={member.username}
                                            >
                                                {member.avatarInitials || member.username?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
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
                    <div className="background-update-container" style={{ marginTop: "12px" }}>
                        <input
                            type="text"
                            placeholder="Enter background URL"
                            value={backgroundUrlInput}
                            onChange={(e) => setBackgroundUrlInput(e.target.value)}
                            className="background-url-input"
                        />
                        <button
                            onClick={handleUpdateBackground}
                            className="background-url-button"
                        >
                            Set
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
