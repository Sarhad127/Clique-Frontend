import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

        setError(null);
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Failed to reset password.");
                setLoading(false);
                return;
            }

            setSuccess("Password reset successful! You can now log in.");
            setLoading(false);

            setTimeout(() => navigate("/login"), 3000);

        } catch (err) {
            setError("Network error. Please try again later.");
            setLoading(false);
        }
    };

    return (
        <div className="main-container" style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
            <h2>Reset Password</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            {!success && token && (
                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: 10 }}>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: 10 }}>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default ResetPassword;
