import React from "react";
import './styles/GroupChats.css';

export default function GroupChats({ groupChats, user, onGroupCreated }) {
    console.log("User in GroupChats:", user.id);

    const createGroup = async () => {
        const groupTitle = prompt("Enter group name:");
        if (!groupTitle) return;
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
                console.log("Group created:", newGroup);
                if (onGroupCreated) onGroupCreated(newGroup);
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
                    onClick={createGroup}
                    aria-label="Add Friend"
                >
                    Create Group
                </button>
            </div>

            {groupChats && groupChats.length > 0 && (
                groupChats.map((group) => (
                    <div key={group.id}>
                        <h4>{group.title}</h4>
                        {/* Add more info if needed */}
                    </div>
                ))
            )}
        </div>
    );
}
