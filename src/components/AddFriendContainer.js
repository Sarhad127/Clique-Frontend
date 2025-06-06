import React, { useState } from "react";

const AddFriendContainer = ({ token }) => {
    const [identifier, setIdentifier] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const handleAddFriend = async () => {
        if (!identifier.trim()) {
            setStatusMessage("Please enter a username or email.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/friends/add?identifier=${encodeURIComponent(identifier)}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const message = await response.text();
            if (response.ok) {
                setStatusMessage(message);
                setIdentifier("");
            } else {
                setStatusMessage(message);
            }
        } catch (error) {
            console.error("Error adding friend:", error);
            setStatusMessage("Could not reach server.");
        }
    };

    return (
        <div className="add-friend-container">
            <h4>Add a Friend</h4>
            <input
                type="text"
                placeholder="Enter friend's email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
            />
            <button onClick={handleAddFriend}>Send Request</button>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default AddFriendContainer;