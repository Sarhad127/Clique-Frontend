import CliqueIcon from "./icons/Clique-icon.png";
import {useNavigate} from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();
    return (
        <div className="main-container">
            <div className="Clique-login-title" onClick={() => navigate('/home')}>
                <img src={CliqueIcon} alt="Clique Logo" className="clique-logo" />
                <span>Clique</span>
            </div>

            <div className="main-login">
                <div className="login-title">Reset your password</div>
                <form className="login-form">
                    <div className="input-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="login-button">Send reset link</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default ForgotPassword;