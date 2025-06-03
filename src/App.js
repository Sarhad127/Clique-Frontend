import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
          </Routes>
      </Router>
  );
}

export default App;
