import './styles/Clique.css';
import './styles/FIRST-CONTAINER.css';
import './styles/SECOND-CONTAINER.css';
import './styles/THIRD-CONTAINER.css';
import './styles/FOURTH-CONTAINER.css';

import { useNavigate } from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import { UserContext } from "./UserProvider";
import ProfileSection from "./ProfileSection";
import ChatBox from "./ChatBox";
import {saveUsername, saveDescription, fetchChats, deleteChat} from './api';
import FirstContainer from "./FirstContainer";
import SecondContainer from "./SecondContainer";
import FourthContainer from "./FourthContainer";
import GroupChatBox from "./GroupChatBox";

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
    user?.friends?.find(friend => friend.id === selectedFriendId);
    const [description, setDescription] = useState(user?.description || "");
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [chatList, setChatList] = useState(user?.directMessages || []);
    const [selectedFriends, setSelectedFriend] = useState(null);
    const [, setActiveChatId] = useState(null);
    const [selectedGroupChat, setSelectedGroupChat] = useState(null);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    function handleLogout() {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/home');
    }

    useEffect(() => {
        if (user?.description !== undefined) {
            setDescription(user.description);
        }
    }, [user?.description]);

    const handleFriendClick = (friendId) => {
        setSelectedFriendId(friendId);
        setActiveSection('chat');
        setSelectedFriend(null);
        setActiveChatId(friendId);
        setSelectedGroupChat(null);
    };

    async function handleDeleteChat(chatId) {
        if (window.confirm("Are you sure you want to delete this chat?")) {
            try {
                await deleteChat(chatId, token);
                setChatList(prevChats => prevChats.filter(chat => chat.id !== chatId));
                console.log("Deleted chat with ID:", chatId);
            } catch (error) {
                console.error("Error deleting chat:", error);
                alert("Failed to delete chat. Please try again.");
            }
        }
    }

    async function handleSaveUsername() {
        try {
            await saveUsername(newUsername, token);
            setUser(prevUser => ({
                ...prevUser,
                username: newUsername
            }));
            console.log(newUsername)
            setIsEditingUsername(false);
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleSaveDescription(desc) {
        try {
            await saveDescription(desc, token);
            setUser(prevUser => ({
                ...prevUser,
                description: desc.trim()
            }));
            setDescription(desc.trim());
            setIsEditingDescription(false);
        } catch (error) {
            alert(error.message);
        }
    }

    useEffect(() => {
        async function loadChats() {
            try {
                const chats = await fetchChats(token);
                setChatList(chats);
            } catch (error) {
                console.error("Error fetching chats:", error.message);
            }
        }

        if (user) {
            loadChats();
        }
    }, [user]);

    return (
        <div className="clique-page">
            <div className="clique-main-container">

                <FirstContainer
                    serverSection={serverSection}
                    setServerSection={setServerSection}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    handleLogout={handleLogout}
                    setSelectedFriend={setSelectedFriend}
                    setSelectedGroupChat={setSelectedGroupChat}
                    setSelectedFriendId={setSelectedFriendId}
                    setSelectedGroupId={setSelectedGroupId}
                />

                <SecondContainer
                    serverSection={serverSection}
                    setServerSection={setServerSection}
                    allChatsTab={allChatsTab}
                    setAllChatsTab={setAllChatsTab}
                    chatList={chatList}
                    user={user}
                    handleFriendClick={handleFriendClick}
                    onGroupSelected={(group) => {
                        setSelectedGroupChat(group);
                        setSelectedGroupId(group.id);
                        setSelectedFriendId(null);
                        setActiveSection("chat");
                    }}
                    showAddFriend={showAddFriend}
                    setShowAddFriend={setShowAddFriend}
                    setSelectedFriend={setSelectedFriend}
                    setSelectedGroupChat={setSelectedGroupChat}
                    handleDeleteChat={handleDeleteChat}
                />

                <div className="THIRD-CONTAINER">
                    {activeSection === "profile" ? (
                        <ProfileSection
                            user={user}
                            isEditingUsername={isEditingUsername}
                            setIsEditingUsername={setIsEditingUsername}
                            newUsername={newUsername}
                            setNewUsername={setNewUsername}
                            saveUsername={handleSaveUsername}
                            description={description}
                            setDescription={setDescription}
                            isEditingDescription={isEditingDescription}
                            setIsEditingDescription={setIsEditingDescription}
                            saveDescription={handleSaveDescription}
                        />
                    ) : selectedFriendId ? (
                        <ChatBox user={user}
                                 friendId={selectedFriendId}
                                 friend={user?.friends?.find(friend => friend.id === selectedFriendId)} />
                    ) : selectedGroupId ? (
                        <GroupChatBox
                            user={user}
                            groupId={selectedGroupId}
                            onClose={() => setSelectedGroupId(null)}
                            selectedGroupChat={selectedGroupChat}
                        />
                    ) : (
                        <div></div>
                    )}
                </div>

                <FourthContainer
                    selectedFriends={selectedFriends}
                    selectedGroupChat={selectedGroupChat}
                    user={user}
                    chatList={chatList}
                    setChatList={setChatList}
                    setServerSection={setServerSection}
                    setAllChatsTab={setAllChatsTab}
                    setSelectedFriendId={setSelectedFriendId}
                    setActiveSection={setActiveSection}
                    setSelectedFriend={setSelectedFriend}
                    setActiveChatId={setActiveChatId}
                    setSelectedGroupChat={setSelectedGroupChat}
                />
            </div>
        </div>
    );
}

export default Clique;