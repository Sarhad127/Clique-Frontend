import './styles/Clique.css';
import CliqueIcon from "./icons/Clique-icon.png";
import Logout from './icons/logout.png';
import AllChats from './icons/all-chats.png';
import Friends from './icons/friends.png';
import Profile from './icons/profile.png';

function Clique() {
    return (
        <div className="clique-page">
            <div className="clique-main-container">

                <div className="sidebar-nav">
                    <div className="Clique-logo-sidebar">
                        <img src={CliqueIcon} alt="Clique Logo" className="clique-logo" />
                    </div>
                    <nav className="sidebar-nav-icons">
                        <div className="nav-icon-container">
                            <img src={AllChats} alt="All Chats" className="nav-icon" />
                            <span>All chats</span>
                        </div>
                        <div className="nav-icon-container">
                            <img src={Friends} alt="Friends" className="nav-icon" />
                            <span>Friends</span>
                        </div>
                        <div className="nav-icon-container">
                            <img src={Profile} alt="Profile" className="nav-icon" />
                            <span>Profile</span>
                        </div>
                    </nav>
                    <div className="logout-icon">
                        <img src={Logout} alt="Logout logo" className="nav-icon" />
                        <span>Log out</span>
                    </div>
                </div>

                <div className="server-list"></div>
                <div className="chat-box">Chat Box</div>
                <div className="extra-panel">Extra</div>

            </div>
        </div>
    );
}

export default Clique;