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
                                    placeholder="Enter your username or email"
                                    required
                                />
                                <label htmlFor="usernameOrEmail">Username or Email</label>
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    required
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="button-group">
                                <button type="submit" className="login-button">Log In</button>
                                <button type="submit" className="register-button"
                                        onClick={() => navigate('/register')}
                                >Sign Up</button>
                            </div>
                        </form>
                    </section>

                </div>
            </div>
        </>
    )
}
export default Login;