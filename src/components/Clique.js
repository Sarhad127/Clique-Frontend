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
                                {allChatsTab === 'chat' && (
                                    <div>
                                        <h2>Direct Messages</h2>
                                        <div className="chat-item">
                                            <img src="https://i.pravatar.cc/40?img=3" alt="User" className="chat-item-avatar" />
                                            <div className="chat-item-info">
                                                <div className="chat-item-name">Sarah Johnson</div>
                                                <div className="chat-item-preview">Hey, how are you doing?</div>
                                            </div>
                                        </div>
                                        {/* More chat items */}
                                    </div>
                                )}
                                {allChatsTab === 'groups' && (
                                    <div>
                                        <h2>Group Chats</h2>
                                        <div className="chat-item">
                                            <img src="https://i.pravatar.cc/40?img=5" alt="Group" className="chat-item-avatar" />
                                            <div className="chat-item-info">
                                                <div className="chat-item-name">Game Night</div>
                                                <div className="chat-item-preview">Alex: When are we playing next?</div>
                                            </div>
                                        </div>
                                        {/* More group items */}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {serverSection === 'friends' && (
                        <div className="friends-list">
                            <div className="friends-header">
                                <h3 className="friends-title">Friends</h3>
                                <button
                                    className="add-friend-btn"
                                    onClick={() => alert('Add friend clicked!')}
                                    aria-label="Add Friend"
                                >
                                    +
                                </button>
                            </div>
                            <div className="friends-container">
                                <ul>
                                    <li className="friend-item">
                                        <img src="https://i.pravatar.cc/40?img=1" alt="Friend 1" />
                                        <span>John Doe</span>
                                        <div className="status-indicator"></div>
                                    </li>
                                    <li className="friend-item">
                                        <img src="https://i.pravatar.cc/40?img=2" alt="Friend 2" />
                                        <span>Jane Smith</span>
                                        <div className="status-indicator status-idle"></div>
                                    </li>
                                    {/* Add more friends as needed */}
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