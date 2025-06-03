import CliqueIcon from "./icons/Clique-icon.png";
import './styles/Home.css'
import {useEffect, useState} from "react";
import home1 from './images/Home/home1.png'
import home2 from './images/Home/home2.png'
import home3 from './images/Home/home3.png'
import home4 from './images/Home/home4.png'
import home5 from './images/Home/home5.png'
import home6 from './images/Home/home6.png'
import {useNavigate} from "react-router-dom";

const images = [
    home1,
    home2,
    home3,
    home4,
    home5,
    home6,
]

function Home() {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev+1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return(
        <>
            <div className="main-container">
                <div className="Clique-login-title">
                    <img src={CliqueIcon} alt="Clique Logo" className="clique-logo" />
                    <span>Clique</span>
                </div>
                <div className="home-page">
                    <div className="slider-wrapper">
                        <div
                            className="slider"
                            style={{ transform: `translateX(-${current * 100}%)` }}
                        >
                            {images.map((src, i) => (
                                <img src={src} alt={`Slide ${i}`} key={i} className="slide-img" />
                            ))}
                        </div>
                        <div className="home-text">
                            <span>Start chatting today!</span>
                            <br/>
                            Log in or sign up for free to connect with your friends and colleagues.
                        </div>
                    </div>
                    <div className="bottom-buttons">
                        <button className="home-btn login-btn"
                        onClick={() => navigate('/Login')}
                        >Login</button>
                        <button className="home-btn register-btn">Sign Up</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Home;