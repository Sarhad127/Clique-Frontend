import CliqueIcon from "./icons/Clique-icon.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendForgotPasswordEmail } from './api';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        setLoading(true);
        try {
            const successMsg = await sendForgotPasswordEmail(email);
            setMessage({ type: "success", text: successMsg });
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Network error, try again later." });
        }
        setLoading(false);
    };

    return (
        <div className="main-container">
            <div className="Clique-login-title" onClick={() => navigate('/home')}>
                <img src={CliqueIcon} alt="Clique Logo" className="clique-logo" />
                <span>Clique</span>
            </div>

            <div className="main-login">
                <div className="login-title">Reset your password</div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {message && (
                        <p style={{ color: message.type === "error" ? "red" : "green" }}>
                            {message.text}
                        </p>
                    )}
                    <div className="button-group">
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Sending..." : "Send reset link"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
