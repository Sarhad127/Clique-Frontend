import CliqueIcon from "./icons/Clique-icon.png";
import './styles/Register.css'
import {useNavigate} from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    return(
        <>
            <div className="main-container">

                <div className="Clique-login-title">
                    <img src={CliqueIcon} alt="Clique Logo" className="clique-logo" />
                    <span>Clique</span>
                </div>

                <div className="home-page">
                    <div className="register-title">Register</div>
                    <section className="login-form">

                        <form>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="Email"
                                    name="Email"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="Username"
                                    name="Username"
                                    placeholder="Username"
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
                                </div>
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    required
                                />
                                <div>
                                </div>
                            </div>
                            <div className="button-group">
                                <button type="submit" className="Register-button">Sign up</button>
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
export default Register;