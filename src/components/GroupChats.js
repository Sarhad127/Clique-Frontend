import React, { useState, useEffect } from "react";
import './styles/GroupChats.css';
import { fetchGroups,createGroup,fetchGroupMessages } from './api';

export default function GroupChats({ onGroupCreated, onGroupSelected}) {
    const [showInput, setShowInput] = useState(false);
    const [groupTitle, setGroupTitle] = useState("");
    const [groupChats, setGroupChats] = useState([]);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const loadGroups = async () => {
        try {
            const groups = await fetchGroups(token);
            const groupsWithLastMessage = await Promise.all(
                groups.map(async (group) => {
                    const messages = await fetchGroupMessages(group.id, token);
                    const lastMessage = messages.length ? messages[messages.length - 1] : null;
                    return {
                        ...group,
                        lastMessage,
                    };
                })
            );

            setGroupChats(groupsWithLastMessage);
        } catch (error) {
            console.error("Error fetching groups or messages:", error);
        }
    };

    useEffect(() => {
        loadGroups();
    }, []);

    const handleCreateClick = async () => {
        try {
            const newGroup = await createGroup(groupTitle, token);
            if (onGroupCreated) onGroupCreated(newGroup);
            setGroupChats((prev) => [...prev, newGroup]);
            setGroupTitle("");
            setShowInput(false);
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    function formatDateTime(timestamp) {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }) + ", " + date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });
    }


    return (
        <div>
            <div className="group-header">
                <button
                    className="create-group-button"
                    onClick={() => setShowInput(prev => !prev)}
                    aria-label="Add Group"
                >
                    Create Group
                </button>
            </div>

            {showInput && (
                <div className="create-group-container">
                    <input
                        type="text"
                        value={groupTitle}
                        onChange={(e) => setGroupTitle(e.target.value)}
                        placeholder="Enter group name"
                    />
                    <button onClick={handleCreateClick}>Create</button>
                </div>
            )}

            <div className="group-list">
                {groupChats.map(group => (
                    (() => {
                        const members = group.members || [];

                        return (
                            <div className="group-card" key={group.id} onClick={() => onGroupSelected && onGroupSelected({ ...group, members })} style={{ cursor: "pointer" }}>
                                <div className="group-header-row">
                                    <h4 className="group-title">{group.title}</h4>
                                    <div className="group-avatars">
                                        {members.map(member => (
                                            <img
                                                key={member.id}
                                                src={member.avatarUrl || "/default-avatar.png"}
                                                alt={member.username || "User avatar"}
                                                className="avatar-small"
                                                title={member.username}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {group.lastMessage && (
                                    <div className="last-message-preview">
                                        <div className="last-message-time">{formatDateTime(group.lastMessage.timestamp)}</div>
                                        <small>
                                            <strong>{group.lastMessage.senderUsername}:</strong> {group.lastMessage.content}
                                        </small>
                                    </div>
                                )}
                            </div>
                        );
                    })()
                ))}
            </div>
        </div>
    );
}
