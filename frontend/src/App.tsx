import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "./pages/Login";
import Home from "@/pages/Home";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
