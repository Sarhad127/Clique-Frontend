import './styles/Login.css'
import CliqueIcon from './icons/Clique-icon.png'
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    return(
        <>
            <div className="main-container">
            <div className="Clique-login-title">
                <img src={CliqueIcon} alt="Clique Logo" className="clique-logo" />
                <span>Clique</span>
            </div>
                <div className="main-login">
                    <div className="login-title">Login</div>

                    <section className="login-form">
                        <form>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="usernameOrEmail"
                                    name="usernameOrEmail"
                                    placeholder="Username or Email"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                />
                                <div>
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
                            </div>
                            <div className="button-group">
                                <button type="submit" className="login-button">Log In</button>
                            </div>
                            <div className="create-account-link-container">
                                <p className="create-account-link" onClick={() => navigate('/register')}>
                                    Create new account
                                </p>
                            </div>
                            <div className="create-account-link-container">
                                <p className="create-account-link" onClick={() => navigate('/home')}>
                                    Home
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