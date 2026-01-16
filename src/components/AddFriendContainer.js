import React, { useState } from "react";
import { addFriend } from './api';

const AddFriendContainer = ({ token }) => {
    const [identifier, setIdentifier] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const handleAddFriend = async () => {
        try {
            const message = await addFriend(identifier, token);
            setStatusMessage(message);
            setIdentifier("");
        } catch (error) {
            setStatusMessage(error.message || "Could not reach server.");
            console.error("Error adding friend:", error);
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