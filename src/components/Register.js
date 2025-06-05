import CliqueIcon from "./icons/Clique-icon.png";
import './styles/Register.css'
import {useNavigate} from "react-router-dom";
import {useState} from "react";

function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);

    const validatePassword = (password) => {
        const hasCapital = /[A-Z]/.test(password);
        const hasMinLength = password.length >= 6;
        return hasCapital && hasMinLength;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            setError("Password must be at least 6 characters long and contain at least one capital letter.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError(null);
        try {
            const emailCheckResponse = await fetch(`http://localhost:8080/auth/check-email?email=${encodeURIComponent(email)}`);
            const emailCheckData = await emailCheckResponse.json();

            if (!emailCheckData.available) {
                setError("Email is already registered");
                return;
            }

            const response = await fetch("http://localhost:8080/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({ email, username, password}),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Registration failed");
                return;
            }
            navigate('/login');
        } catch (err) {
            setError("Network error. Please try again later.");
        }
    }

    return(
        <>
            <div className="main-container">

                <div className="Clique-login-title" onClick={() => navigate('/home')}>
                    <img src={CliqueIcon} alt="Clique Logo" className="clique-logo" />
                    <span>Clique</span>
                </div>

                <div className="home-page">
                    <div className="register-title">Register</div>
                    <section className="login-form">

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    id="Email"
                                    name="Email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e)=> setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="Username"
                                    name="Username"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div>
                                </div>
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <div>
                                </div>
                            </div>

                            {error && <p style={{ color: "red" }}>{error}</p>}

                            <div className="button-group">
                                <button type="submit" className="Register-button">Sign up</button>
                            </div>
                        </form>
                    </section>

                </div>
            </div>
        </>
    )
}
export default Register;