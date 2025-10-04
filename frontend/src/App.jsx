import "./App.css";
import LoginPage from "../components/LoginForm";
import SignupPage from "../components/SignupForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LandingPage } from "../pages/LandingPage";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <div
      className="min-h-screen w-full bg-center bg-cover"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/dashboard" element={<LandingPage />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
