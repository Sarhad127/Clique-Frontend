import CliqueIcon from "./icons/Clique-icon.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!email) {
            setMessage({ type: "error", text: "Please enter your email" });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                setMessage({ type: "error", text: data || "Error sending reset email" });
            } else {
                setMessage({ type: "success", text: "Password reset email sent. Please check your inbox." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Network error, try again later." });
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
