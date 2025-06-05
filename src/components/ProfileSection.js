
const ProfileSection = ({ user, isEditingUsername, setIsEditingUsername, newUsername, setNewUsername, saveUsername }) => {
    return (
        <div className="profile-info">
            <div className="profile-header">
                <h2>My Profile</h2>
            </div>

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
                </div>

                <div className="profile-actions">
                    <button className="edit-profile-btn">Edit Profile</button>
                    <button className="change-password-btn">Change Password</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
