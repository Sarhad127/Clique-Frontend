import React from "react";
import GroupChats from "./GroupChats";
import FriendsList from "./FriendsList";
import { Trash2 } from 'lucide-react';

function SecondContainer({
                             serverSection,
                             allChatsTab,
                             setAllChatsTab,
                             chatList,
                             user,
                             handleFriendClick,
                             showAddFriend,
                             setShowAddFriend,
                             setSelectedFriend,
                             onGroupSelected,
                             handleDeleteChat
                         }) {
    return (
        <div className="SECOND-CONTAINER">
            {serverSection === "allChats" && (
                <div className="all-chats-container">
                    <div className="all-chats-tabs">
                        <button
                            className={allChatsTab === "chat" ? "active-tab" : ""}
                            onClick={() => setAllChatsTab("chat")}
                        >
                            Chats
                        </button>
                        <button
                            className={allChatsTab === "groups" ? "active-tab" : ""}
                            onClick={() => setAllChatsTab("groups")}
                        >
                            Group Chats
                        </button>
                    </div>

                    <div className="all-chats-content">
                        {allChatsTab === "chat" && (
                            <div>
                                {chatList.length > 0 ? (
                                    chatList.map((chat) => {
                                        const participants = chat.participants || [];
                                        const messages = chat.messages || [];
                                        if (!Array.isArray(participants) || participants.length === 0) return null;
                                        const otherParticipant = participants.find((p) => p.id !== user.id);
                                        if (!otherParticipant) return null;
                                        const lastMessage = messages[messages.length - 1];
                                        return (
                                            <div
                                                key={chat.id}
                                                className={`chat-item ${participants.some((p) => p.id === chat.id) ? "active-chat" : ""}`}
                                                onClick={() => handleFriendClick(otherParticipant.id)}
                                                style={{ position: "relative" }}
                                            >
                                                <div
                                                    className="chat-item-trash"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteChat(chat.id);
                                                    }}
                                                    title="Delete Chat"
                                                >
                                                    <Trash2 size={12} />
                                                </div>
                                                <img
                                                    src={
                                                        otherParticipant.avatarUrl ||
                                                        `https://i.pravatar.cc/40?u=${otherParticipant.id}`
                                                    }
                                                    alt={otherParticipant.username || "User"}
                                                    className="chat-item-avatar"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                            otherParticipant.username || "User"
                                                        )}&background=random&size=40`;
                                                    }}
                                                />
                                                <div className="chat-item-info">
                                                    <div className="chat-item-name">{otherParticipant.username}</div>
                                                    <div className="chat-item-preview">
                                                        {lastMessage && (
                                                            <span className="message-time-preview">
                                                              {new Date(lastMessage.timestamp).toLocaleDateString(undefined, {
                                                                  year: "numeric",
                                                                  month: "short",
                                                                  day: "numeric",
                                                                  hour: "2-digit",
                                                                  minute: "2-digit",
                                                              })}
                                                            </span>
                                                        )}
                                                        {lastMessage ? (
                                                            <span
                                                                className="message-content-preview"
                                                                title={
                                                                    lastMessage.senderId === user.id
                                                                        ? `You: ${lastMessage.content}`
                                                                        : `${otherParticipant.username}: ${lastMessage.content}`
                                                                }
                                                            >
                                                              {lastMessage.senderId === user.id
                                                                  ? `You: ${lastMessage.content}`
                                                                  : `${otherParticipant.username}: ${lastMessage.content}`}
                                                            </span>
                                                        ) : (
                                                            "No messages yet"
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        )}

                        {allChatsTab === "groups" && (
                            <GroupChats
                                groupChats={user?.groupChats}
                                user={user}
                                onGroupSelected={onGroupSelected}
                            />
                        )}
                    </div>
                </div>
            )}

            {serverSection === "friends" && (
                <FriendsList
                    user={user}
                    showAddFriend={showAddFriend}
                    setShowAddFriend={setShowAddFriend}
                    onFriendClick={(friendId) => {
                        const friend = user.friends.find((f) => f.id === friendId);
                        if (!friend) return;
                        setSelectedFriend(friend);
                    }}
                />
            )}
        </div>
    );
}

export default SecondContainer;
