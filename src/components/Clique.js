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

import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "./UserProvider";
import FriendsList from "./FriendsList";
import ProfileSection from "./ProfileSection";
import ChatBox from "./ChatBox";

function Clique() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('allChats');
    const [serverSection, setServerSection] = useState('allChats');
    const [allChatsTab, setAllChatsTab] = useState('chat');
    const { user, setUser } = useContext(UserContext);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(user?.username || "");
    const [selectedFriendId, setSelectedFriendId] = useState(null);

    function handleLogout() {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/home');
    }

    function handleServerSectionChange(section) {
        setServerSection(section);
    }

    function handleProfileClick() {
        setActiveSection('profile');
    }

    const handleFriendClick = (friendId) => {
        console.log("Friend clicked:", friendId);
        setSelectedFriendId(friendId);
        setActiveSection('chat');
    };

    async function saveUsername() {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const response = await fetch("http://localhost:8080/user/username", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ username: newUsername }),
            });

            if (!response.ok) {
                throw new Error("Failed to update username");
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditingUsername(false);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="clique-page">
            <div className="TOP-NAVBAR">
                <div className="navbar-right">
                </div>
            </div>
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
                        <img src={Logout} alt="Logout logo" className="nav-icon" onClick={handleLogout} />
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
                                        {user?.directMessages?.length > 0 ? (
                                            user.directMessages.map((chat) => (
                                                <div key={chat.id} className="chat-item" onClick={() => handleFriendClick(chat.id)}>
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
                        <FriendsList
                            user={user}
                            showAddFriend={showAddFriend}
                            setShowAddFriend={setShowAddFriend}
                            onFriendClick={(friendId) => {
                                console.log("Friend clicked from child:", friendId);
                                setSelectedFriendId(friendId);
                                setActiveSection('chat');
                            }}
                        />
                    )}
                </div>

                <div className="THIRD-CONTAINER">
                    {activeSection === "profile" ? (
                        <ProfileSection
                            user={user}
                            isEditingUsername={isEditingUsername}
                            setIsEditingUsername={setIsEditingUsername}
                            newUsername={newUsername}
                            setNewUsername={setNewUsername}
                            saveUsername={saveUsername}
                        />
                    ) : (
                            selectedFriendId ? (
                                <ChatBox user={user} friendId={selectedFriendId} />
                            ) : (
                                <div></div>
                            )
                    )}
                </div>

                <div className="FOURTH-CONTAINER">

                </div>
            </div>
        </div>
    );
}

export default Clique;
