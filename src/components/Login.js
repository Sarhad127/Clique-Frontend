import './styles/Login.css'
import CliqueIcon from './icons/Clique-icon.png'
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import { useContext } from "react";
import { UserContext } from "./UserProvider";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg]  = useState('');
    const { fetchUser } = useContext(UserContext);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            email: email,
            password: password
        };
        console.log(payload)
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                if (rememberMe) {
                    localStorage.setItem('token', token);
                } else {
                    sessionStorage.setItem('token', token);
                }
                await fetchUser();
                navigate('/Clique');
            } else {
                const errorData = await response.json();

                switch (errorData.error) {
                    case "EMAIL_NOT_FOUND":
                        setErrorMsg("Email not found. Please register first.");
                        break;
                    case "WRONG_PASSWORD":
                        setErrorMsg("Incorrect password. Please try again.");
                        break;
                    case "ACCOUNT_NOT_VERIFIED":
                        setErrorMsg("Account not verified. Please check your email.");
                        break;
                    default:
                        setErrorMsg("Login failed. Please try again.");
                }
            }
        } catch (error) {
            setErrorMsg("Login failed. Please try again later.");
            console.error("Login error:", error);
        }
    };

    return(
        <>
            <div className="main-container">
            <div className="Clique-login-title" onClick={() => navigate('/home')}>
                <img src={CliqueIcon} alt="Clique Logo" className="clique-logo" />
                <span>Clique</span>
            </div>
                <div className="main-login">
                    <div className="login-title">Login</div>

                    <section className="login-form">
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    id="Email"
                                    name="Email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                    />
                                    Show Password
                                </label>
                                <div className="remember-me">
                                    <label className="checkbox-label-2">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={() => setRememberMe(!rememberMe)}
                                        />
                                        Remember Me
                                    </label>
                                </div>
                                <div className="forgot-password">
                                    <button
                                        type="button"
                                        className="forgot-password-link"
                                        onClick={() => navigate('/forgot-password')}
                                    >
                                        Forgotten password?
                                    </button>
                                </div>
                            </div>
                            {errorMsg && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMsg}</p>}
                            <div className="button-group">
                                <button type="submit" className="login-button">Log In</button>
                            </div>
                            <div className="create-account-link-container">
                                <p className="create-account-link" onClick={() => navigate('/register')}>
                                    Create new account
                                </p>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </>
    )
}
export default Login;