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
import FriendDetails from "./FriendDetails";

import { useNavigate } from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import { UserContext } from "./UserProvider";
import FriendsList from "./FriendsList";
import ProfileSection from "./ProfileSection";
import ChatBox from "./ChatBox";
import GroupChats from "./GroupChats";

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
    const selectedFriend = user?.friends?.find(friend => friend.id === selectedFriendId);
    const [description, setDescription] = useState(user?.description || "");
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [chatList, setChatList] = useState(user?.directMessages || []);
    const [selectedFriends, setSelectedFriend] = useState(null);
    const [activeChatId, setActiveChatId] = useState(null);

    function handleLogout() {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/home');
    }

    function handleServerSectionChange(section) {
        setServerSection(section);
        if (section === 'friends') {
            setActiveSection('');
            setSelectedFriendId(null);
        }
    }

    function handleProfileClick() {
        setActiveSection('profile');
    }

    const handleFriendClick = (friendId) => {
        console.log("Friend clicked:", friendId);
        setSelectedFriendId(friendId);
        setActiveSection('chat');
        setSelectedFriend(null);
        setActiveChatId(friendId);
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

    const saveDescription = async (desc) => {
        try {
            const response = await fetch('http://localhost:8080/user/description', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify({ description: desc }),
            });

            const data = await response.json();

            if (response.ok) {
                setDescription(data.description);
                console.log("Description saved:", data.description);
            } else {
                console.error("Failed to save description:", data.message || data);
            }
        } catch (error) {
            console.error("Error while saving description:", error);
        }
    };

    useEffect(() => {
        async function fetchChats() {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                const response = await fetch("http://localhost:8080/api/chats", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch chats");
                }
                const chats = await response.json();
                console.log(chats)
                setChatList(chats);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        }
        if (user) {
            fetchChats();
        }
    }, [user]);

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
                                        {chatList.length > 0 ? (
                                            chatList.map((chat) => {
                                                const participants = chat.participants || [];
                                                const messages = chat.messages || [];
                                                if (!Array.isArray(participants) || participants.length === 0) return null;
                                                const otherParticipant = participants.find(p => p.id !== user.id);
                                                if (!otherParticipant) return null;
                                                const lastMessage = messages[messages.length - 1];
                                                return (
                                                    <div
                                                        key={chat.id}
                                                        className={`chat-item ${participants.some(p => p.id === activeChatId) ? 'active-chat' : ''}`}
                                                        onClick={() => handleFriendClick(otherParticipant.id)}
                                                    >
                                                        <img
                                                            src={otherParticipant.avatarUrl || `https://i.pravatar.cc/40?u=${otherParticipant.id}`}
                                                            alt={otherParticipant.username || "User"}
                                                            className="chat-item-avatar"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.username || "User")}&background=random&size=40`;
                                                            }}
                                                        />
                                                        <div className="chat-item-info">
                                                            <div className="chat-item-name">{otherParticipant.username}</div>
                                                            <div className="chat-item-preview">{lastMessage ? lastMessage.content : "No messages yet"}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                )}

                                {allChatsTab === "groups" && <GroupChats groupChats={user?.groupChats} user={user} />}
                            </div>
                        </div>
                    )}

                    {serverSection === "friends" && (
                        <FriendsList
                            user={user}
                            showAddFriend={showAddFriend}
                            setShowAddFriend={setShowAddFriend}
                            onFriendClick={(friendId) => {
                                const friend = user.friends.find(f => f.id === friendId);
                                if (!friend) return;
                                setSelectedFriend(friend);
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
                            description={description}
                            setDescription={setDescription}
                            isEditingDescription={isEditingDescription}
                            setIsEditingDescription={setIsEditingDescription}
                            saveDescription={saveDescription}
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
                    {selectedFriends ? (
                        <FriendDetails
                            friend={selectedFriends}
                            onStartChat={async (friendId) => {
                                const friend = user.friends.find(f => f.id === friendId);
                                if (!friend) return;
                                try {
                                    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                                    const response = await fetch(`http://localhost:8080/api/chats/start?friendId=${friendId}`, {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': `Bearer ${token}`
                                        }
                                    });
                                    if (!response.ok) {
                                        throw new Error('Failed to create chat');
                                    }
                                    const chatData = await response.json();
                                    if (!chatList.some(chat => chat.id === chatData.id)) {
                                        setChatList(prev => [
                                            ...prev,
                                            {
                                                id: chatData.id,
                                                username: friend.username,
                                                avatarUrl: friend.avatarUrl || `https://i.pravatar.cc/40?u=${friend.id}`,
                                                lastMessagePreview: chatData.lastMessage || "",
                                            }
                                        ]);
                                    }
                                    setServerSection("allChats");
                                    setAllChatsTab("chat");
                                    setSelectedFriendId(friendId);
                                    setActiveSection("chat");
                                    setSelectedFriend(null);
                                    setActiveChatId(friendId);
                                } catch (error) {
                                    console.error("Error starting chat:", error);
                                }
                            }}
                        />
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Clique;
