import React from "react";
import CliqueIcon from "./icons/Clique-icon.png";
import Logout from './icons/logout.png';
import AllChats from './icons/all-chats.png';
import Friends from './icons/friends.png';
import Profile from './icons/profile.png';

function FirstContainer({
                            serverSection,
                            setServerSection,
                            activeSection,
                            setActiveSection,
                            handleLogout
                        }) {
    const handleServerSectionChange = (section) => {
        setServerSection(section);
        if (section === 'friends') {
            setActiveSection('');
        }
    };

    const handleProfileClick = () => {
        setActiveSection('profile');
    };

    return (
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
            <div className="logout-icon" onClick={handleLogout}>
                <img src={Logout} alt="Logout logo" className="nav-icon" />
                <span>Log out</span>
            </div>
        </div>
    );
}

export default FirstContainer;