import React, {useEffect, useState} from "react";
import './styles/Profile.css';

const ProfileSection = ({
                            user,
                            setUser,
                            isEditingUsername,
                            setIsEditingUsername,
                            newUsername,
                            setNewUsername,
                            saveUsername,
                            description,
                            isEditingDescription,
                            setIsEditingDescription,
                            saveDescription,
                        }) => {
    const [tempDescription, setTempDescription] = useState(description || "");
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [newAvatarUrl, setNewAvatarUrl] = useState(user?.avatarUrl || "");
    const [newAvatarColor, setNewAvatarColor] = useState(user?.avatarColor || "");
    const [newAvatarInitials, setNewAvatarInitials] = useState(user?.avatarInitials || "");
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [errorAvatar, setErrorAvatar] = useState(null);

    useEffect(() => {
        setTempDescription(description || "");
    }, [description]);

    useEffect(() => {
        setNewAvatarUrl(user?.avatarUrl || "");
        setNewAvatarColor(user?.avatarColor || "");
        setNewAvatarInitials(user?.avatarInitials || "");
    }, [user?.avatarUrl, user?.avatarColor, user?.avatarInitials]);

    const onSaveAvatar = async () => {

        setLoadingAvatar(true);
        setErrorAvatar(null);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8080/user/avatar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    avatarUrl: newAvatarUrl.trim(),
                    avatarColor: newAvatarColor.trim(),
                    avatarInitials: newAvatarInitials.trim(),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to update avatar");
            }

            const data = await response.json();

            setUser((prevUser) => ({
                ...prevUser,
                avatarUrl: data.avatarUrl,
                avatarColor: data.avatarColor,
                avatarInitials: data.avatarInitials,
            }));

            setIsEditingAvatar(false);
        } catch (error) {
            setErrorAvatar(error.message);
        } finally {
            setLoadingAvatar(false);
        }
    };

    return (
        <div className="profile-info">
            <div className="profile-content">
                <div className="avatar-section">
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="profile-avatar" />
                    ) : (
                        <div
                            className="avatar-placeholder"
                            style={{ backgroundColor: user?.avatarColor || "#ccc" }}
                        >
                            {(user?.avatarInitials ||
                                user?.username?.charAt(0).toUpperCase() ||
                                "U")}
                        </div>
                    )}

                    {!isEditingAvatar ? (
                        <button
                            className="edit-avatar-btn"
                            onClick={() => setIsEditingAvatar(true)}
                        >
                            Change Avatar
                        </button>
                    ) : (
                        <div className="avatar-edit-input">
                            <input
                                type="text"
                                placeholder="Enter avatar URL"
                                value={newAvatarUrl}
                                onChange={(e) => setNewAvatarUrl(e.target.value)}
                                autoFocus
                                disabled={loadingAvatar}
                            />
                            <input
                                type="text"
                                placeholder="Enter avatar color (e.g. #ff0000)"
                                value={newAvatarColor}
                                onChange={(e) => setNewAvatarColor(e.target.value)}
                                disabled={loadingAvatar}
                            />
                            <input
                                type="text"
                                placeholder="Enter avatar initials"
                                maxLength={3}
                                value={newAvatarInitials}
                                onChange={(e) => setNewAvatarInitials(e.target.value)}
                                disabled={loadingAvatar}
                            />
                            <button
                                className="save-avatar-btn"
                                onClick={onSaveAvatar}
                                disabled={loadingAvatar}
                            >
                                {loadingAvatar ? "Saving..." : "Save"}
                            </button>
                            <button
                                className="cancel-avatar-btn"
                                onClick={() => {
                                    setNewAvatarUrl(user?.avatarUrl || "");
                                    setNewAvatarColor(user?.avatarColor || "");
                                    setNewAvatarInitials(user?.avatarInitials || "");
                                    setIsEditingAvatar(false);
                                    setErrorAvatar(null);
                                }}
                                disabled={loadingAvatar}
                            >
                                Cancel
                            </button>
                            {errorAvatar && <div className="error-message">{errorAvatar}</div>}
                        </div>
                    )}
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
