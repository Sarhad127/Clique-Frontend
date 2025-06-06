import React, { useState } from "react";
import './styles/Profile.css';

const ProfileSection = ({
                            user,
                            isEditingUsername,
                            setIsEditingUsername,
                            newUsername,
                            setNewUsername,
                            saveUsername,
                            description,
                            setDescription,
                            isEditingDescription,
                            setIsEditingDescription,
                            saveDescription,
                        }) => {

    const [tempDescription, setTempDescription] = useState(description || "");

    React.useEffect(() => {
        setTempDescription(description || "");
    }, [description]);

    return (
        <div className="profile-info">
            <div className="profile-content">
                <div className="avatar-section">
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="profile-avatar" />
                    ) : (
                        <div className="avatar-placeholder">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    )}
                    <button className="edit-avatar-btn">Change Avatar</button>
                </div>

                <div className="profile-details">
                    <div className="detail-item">
                        <label>Username</label>
                        <div
                            className="detail-value"
                            style={{ display: "flex", alignItems: "center", gap: "8px" }}
                        >
                            {!isEditingUsername ? (
                                <>
                                    <span>{user?.username || "Loading..."}</span>
                                    <button
                                        className="edit-username-btn"
                                        onClick={() => {
                                            setNewUsername(user?.username || "");
                                            setIsEditingUsername(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        maxLength={30}
                                        autoFocus
                                    />
                                    <button className="save-username-btn" onClick={saveUsername}>
                                        Save
                                    </button>
                                    <button
                                        className="cancel-username-btn"
                                        onClick={() => setIsEditingUsername(false)}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="detail-item">
                        <label>Email</label>
                        <div className="detail-value">{user?.email || "Loading..."}</div>
                    </div>

                    <div className="detail-item">
                        <label>Member Since</label>
                        <div className="detail-value">June 2023</div>
                    </div>

                    <div className="detail-item">
                        <label>Description</label>
                        <div
                            className="detail-value"
                            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                        >
                            {!isEditingDescription ? (
                                <>
                                    <p style={{ whiteSpace: "pre-wrap" }}>{description || "No description yet."}</p>
                                    <button
                                        className="edit-description-btn"
                                        onClick={() => setIsEditingDescription(true)}
                                    >
                                        Edit
                                    </button>
                                </>
                            ) : (
                                <>
                  <textarea
                      rows={4}
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      maxLength={500}
                      autoFocus
                      style={{ resize: "vertical", padding: "8px" }}
                  />
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            className="save-description-btn"
                                            onClick={() => {
                                                saveDescription(tempDescription);
                                                setIsEditingDescription(false);
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="cancel-description-btn"
                                            onClick={() => {
                                                setTempDescription(description || "");
                                                setIsEditingDescription(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
