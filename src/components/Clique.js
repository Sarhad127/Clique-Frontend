import './styles/Clique.css';
import './styles/FIRST-CONTAINER.css';
import './styles/SECOND-CONTAINER.css';
import './styles/THIRD-CONTAINER.css';
import './styles/FOURTH-CONTAINER.css';

import FriendDetails from "./FriendDetails";

import { useNavigate } from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import { UserContext } from "./UserProvider";
import ProfileSection from "./ProfileSection";
import ChatBox from "./ChatBox";
import {saveUsername, saveDescription, fetchChats} from './api';
import FirstContainer from "./FirstContainer";
import SecondContainer from "./SecondContainer";
import FourthContainer from "./FourthContainer";

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
    const [selectedGroupChat, setSelectedGroupChat] = useState(null);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    function handleLogout() {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/home');
    }

    const handleFriendClick = (friendId) => {
        setSelectedFriendId(friendId);
        setActiveSection('chat');
        setSelectedFriend(null);
        setActiveChatId(friendId);
    };

    async function handleSaveUsername() {
        try {
            const updatedUser = await saveUsername(newUsername, token);
            setUser(updatedUser);
            setIsEditingUsername(false);
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleSaveDescription(desc) {
        try {
            const data = await saveDescription(desc, token);
            setDescription(data.description);
        } catch (error) {
            console.error("Error while saving description:", error.message);
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
                />

                <SecondContainer
                    serverSection={serverSection}
                    setServerSection={setServerSection}
                    allChatsTab={allChatsTab}
                    setAllChatsTab={setAllChatsTab}
                    chatList={chatList}
                    user={user}
                    handleFriendClick={handleFriendClick}
                    selectedGroupChat={selectedGroupChat}
                    setSelectedGroupChat={setSelectedGroupChat}
                    showAddFriend={showAddFriend}
                    setShowAddFriend={setShowAddFriend}
                    setSelectedFriend={setSelectedFriend}
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
                    ) : (
                            selectedFriendId ? (
                                <ChatBox user={user} friendId={selectedFriendId} />
                            ) : (
                                <div></div>
                            )
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
                />
            </div>
        </div>
    );
}

export default Clique;