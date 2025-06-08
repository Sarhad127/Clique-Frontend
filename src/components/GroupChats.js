import React, { useState, useEffect } from "react";
import './styles/GroupChats.css';

export default function GroupChats({ onGroupCreated, onGroupSelected, user }) {
    const [showInput, setShowInput] = useState(false);
    const [groupTitle, setGroupTitle] = useState("");
    const [groupChats, setGroupChats] = useState([]);

    const fetchGroups = async () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/groups", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setGroupChats(data);
            } else {
                console.error("Failed to fetch groups:", response.status);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleCreateClick = async () => {
        if (!groupTitle.trim()) return;

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: groupTitle,
                    userIds: []
                })
            });

            if (response.ok) {
                const newGroup = await response.json();
                if (onGroupCreated) onGroupCreated(newGroup);
                setGroupChats((prev) => [...prev, newGroup]);
                setGroupTitle("");
                setShowInput(false);
            } else {
                console.error("Failed to create group:", response.status);
            }
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    return (
        <div>
            <div className="group-header">
                <button
                    className="create-group-button"
                    onClick={() => setShowInput(true)}
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
                            <div
                                className="group-card"
                                key={group.id}
                                onClick={() => onGroupSelected && onGroupSelected({ ...group, members })}
                                style={{ cursor: "pointer" }}
                            >
                                <h4>{group.title}</h4>

                                <div className="group-avatars">
                                    {members.map(member => (
                                        <img
                                            key={member.id}
                                            src={member.avatarUrl || "/default-avatar.png"}
                                            alt={member.username || "User avatar"}
                                            className="avatar-small"
                                            title={member.username}
                                            style={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: "50%",
                                                marginRight: 6,
                                                marginTop: 6,
                                                objectFit: "cover",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })()
                ))}
            </div>
        </div>
    );
}
