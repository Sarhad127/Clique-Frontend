import './styles/Login.css'
import CliqueIcon from './icons/Clique-icon.png'

function Login() {
    return(
        <>
            <div className="main-container">
            <div className="Clique-login-title">
                <img src={CliqueIcon} alt="Clique Logo" className="clique-logo" />
                <span>Clique</span>
            </div>
                <div className="main-login">
                    <div className="login-title">Login</div>
                </div>
            </div>
        </>
    )
}
export default Login;