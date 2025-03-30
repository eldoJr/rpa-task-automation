import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "./pages/Login";
import Home from "@/pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
