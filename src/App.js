import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/Home" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
          </Routes>
      </Router>
  );
}

export default App;
