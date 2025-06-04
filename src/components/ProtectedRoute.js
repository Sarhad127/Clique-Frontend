import {Navigate} from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
        return <Navigate to="/home" replace />
    }
    return children;
};

export default ProtectedRoute;