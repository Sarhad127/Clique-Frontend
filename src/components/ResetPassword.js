import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CliqueIcon from "./icons/Clique-icon.png";
import './styles/Register.css'
import { resetPassword } from './api';

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing token.");
        }
    }, [token]);

    const validatePassword = (password) => {
        const hasCapital = /[A-Z]/.test(password);
        const hasMinLength = password.length >= 6;
        return hasCapital && hasMinLength;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!validatePassword(newPassword)) {
            setError("Password must be at least 6 characters long and contain at least one capital letter.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await resetPassword(token, newPassword);
            setSuccess("Password reset successful! You can now log in.");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message || "Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <div className="Clique-login-title" onClick={() => navigate('/home')}>
                <img src={CliqueIcon} alt="Clique Logo" className="clique-logo" />
                <span>Clique</span>
            </div>
            <div className="home-page">
            <h2 className="register-title">Reset Password</h2>

            {!success && token && (
                <form onSubmit={handleSubmit} className="reset-form">
                    <div className="input-group">
                        <input
                            type="password"
                            className="reset-input"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            className="reset-input"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                  <div className="reset-button">
                      <button
                          type="submit"
                          className="Register-button-2"
                          disabled={loading}
                      >
                          {loading ? "Resetting..." : "Reset Password"}
                      </button>
                  </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </form>
            )}
            </div>
        </div>
    );
}

export default ResetPassword;