import './styles/Clique.css';
import './styles/FIRST-CONTAINER.css';
import './styles/SECOND-CONTAINER.css';
import './styles/THIRD-CONTAINER.css';
import './styles/FOURTH-CONTAINER.css';

import CliqueIcon from "./icons/Clique-icon.png";
import Logout from './icons/logout.png';
import AllChats from './icons/all-chats.png';
import Friends from './icons/friends.png';
import Profile from './icons/profile.png';

import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import { UserContext } from "./UserProvider"

function Clique() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('allChats')
    const [serverSection, setServerSection] = useState('allChats');
    const [allChatsTab, setAllChatsTab] = useState('chat');
    const { user } = useContext(UserContext);

    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/home');
    }

    function handleServerSectionChange(section) {
        setServerSection(section);
    }

    function handleProfileClick() {
        setActiveSection('profile');
    }


    return (
        <div className="clique-page">
            <div className="clique-main-container">

                <div className="FIRST-CONTAINER">
                    <div className="Clique-logo-sidebar">
                        <img src={CliqueIcon} alt="Clique Logo" className="clique-logo" />
                    </div>
                    <hr className="sidebar-divider" />
                    <nav className="sidebar-nav-icons">
                        <div
                            className={`nav-icon-container ${serverSection === 'allChats' ? 'active' : ''}`}
                            onClick={() => handleServerSectionChange('allChats')}
                        >
                            <img src={AllChats} alt="All Chats" className="nav-icon" />
                            <span>All chats</span>
                        </div>
                        <div
                            className={`nav-icon-container ${serverSection === 'friends' ? 'active' : ''}`}
                            onClick={() => handleServerSectionChange('friends')}
                        >
                            <img src={Friends} alt="Friends" className="nav-icon" />
                            <span>Friends</span>
                        </div>
                        <div
                            className={`nav-icon-container ${activeSection === 'profile' ? 'active' : ''}`}
                            onClick={handleProfileClick}
                        >
                            <img src={Profile} alt="Profile" className="nav-icon" />
                            <span>Profile</span>
                        </div>
                    </nav>
                    <hr className="sidebar-divider-second" />
                    <div className="logout-icon">
                        <img src={Logout} alt="Logout logo" className="nav-icon" onClick={handleLogout}/>
                        <span>Log out</span>
                    </div>
                </div>

                <div className="SECOND-CONTAINER">
                    {serverSection === 'allChats' && (
                        <div className="all-chats-container">
                            <div className="all-chats-tabs">
                                <button
                                    className={allChatsTab === 'chat' ? 'active-tab' : ''}
                                    onClick={() => setAllChatsTab('chat')}
                                >
                                    Chats
                                </button>
                                <button
                                    className={allChatsTab === 'groups' ? 'active-tab' : ''}
                                    onClick={() => setAllChatsTab('groups')}
                                >
                                    Group Chats
                                </button>
                            </div>

                            <div className="all-chats-content">
                                {allChatsTab === "chat" && (
                                    <div>
                                        <h2>Direct Messages</h2>
                                        {user?.directMessages?.length > 0 ? (
                                            user.directMessages.map((chat) => (
                                                <div key={chat.id} className="chat-item">
                                                    <img
                                                        src={chat.avatarUrl || `https://i.pravatar.cc/40?u=${chat.id}`}
                                                        alt={chat.username || "User"}
                                                        className="chat-item-avatar"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.username || "User")}&background=random&size=40`;
                                                        }}
                                                    />
                                                    <div className="chat-item-info">
                                                        <div className="chat-item-name">{chat.username}</div>
                                                        <div className="chat-item-preview">{chat.lastMessagePreview}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                )}

                                {allChatsTab === "groups" && (
                                    <div>
                                        <h2>Group Chats</h2>
                                        {user?.groupChats?.length > 0 ? (
                                            user.groupChats.map((group) => (
                                                <div key={group.id} className="chat-item">
                                                    <img
                                                        src={group.avatarUrl || `https://i.pravatar.cc/40?u=${group.id}`}
                                                        alt={group.name || "Group"}
                                                        className="chat-item-avatar"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name || "Group")}&background=random&size=40`;
                                                        }}
                                                    />
                                                    <div className="chat-item-info">
                                                        <div className="chat-item-name">{group.name}</div>
                                                        <div className="chat-item-preview">{group.lastMessagePreview}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {serverSection === "friends" && (
                        <div className="friends-list">
                            <div className="friends-header">
                                <h3 className="friends-title">Friends</h3>
                                <button
                                    className="add-friend-btn"
                                    onClick={() => alert("Add friend clicked!")}
                                    aria-label="Add Friend"
                                >
                                    +
                                </button>
                            </div>
                            <div className="friends-container">
                                <ul>
                                    {user?.friends?.length > 0 ? (
                                        user.friends.map((friend) => (
                                            <li key={friend.id} className="friend-item">
                                                <img
                                                    src={friend.avatarUrl || `https://i.pravatar.cc/40?u=${friend.id}`}
                                                    alt={friend.usernameForController || friend.email || "Friend"}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.usernameForController || friend.email)}&background=random&size=40`;
                                                    }}
                                                />
                                                <span>{friend.usernameForController || friend.email}</span>
                                                <div className="status-indicator"></div>
                                            </li>
                                        ))
                                    ) : (
                                        <li></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <div className="THIRD-CONTAINER">
                    {activeSection === "profile" ? (
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
                                        <div className="detail-value">{user?.username || "Loading..."}</div>
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
                    ) : (
                        <div className="default-chat-box">
                            <div className="chat-container">
                                <div className="chat-messages">
                                    <div className="message incoming">
                                        Hello! This is a message from someone else.
                                        <div className="message-time">Today at 2:30 PM</div>
                                    </div>
                                    <div className="message outgoing">
                                        Hi! This is your reply.
                                        <div className="message-time">Today at 2:32 PM</div>
                                    </div>
                                    <div className="message incoming">
                                        How are you doing today?
                                        <div className="message-time">Today at 2:33 PM</div>
                                    </div>
                                </div>

                                <div className="chat-input-area">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="chat-input"
                                    />
                                    <button className="send-button">Send</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="FOURTH-CONTAINER">

                </div>

            </div>
        </div>
    );
}

export default Clique;