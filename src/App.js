import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Clique from "./components/Clique";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/Home" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/forgot-password" element={<ForgotPassword />}/>
              <Route path="/reset-password" element={<ResetPassword />}/>
              <Route path="/Clique" element={<Clique/>}/>
          </Routes>
      </Router>
  );
}

export default App;
