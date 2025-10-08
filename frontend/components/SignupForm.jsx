import { useState } from "react";
import { RegisterUser } from "../api/user";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [userEmail, setUserEmail] = useState("toni@exam.com");
  const [username, setUsername] = useState("toni123");
  const [password, setPassword] = useState("strongpassword");
  const navigate = useNavigate();
  async function SubmitForm(e) {
    e.preventDefault();
    const response = await RegisterUser(username, userEmail, password);
    if (response && response.code === "USER_REGISTERED") {
      navigate("/"); // SPA-friendly redirect
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-center bg-cover">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
        <h1 className="flex items-center justify-center text-gray-800 text-4xl font-bold mb-6 gap-4">
          <img
            src="looma.png"
            alt="Looma Logo"
            className="w-16 h-16 object-contain"
          />
          <span>Welcome to Looma</span>
        </h1>

        <p className="text-center text-gray-500 mb-8">Register new Account</p>
        <form onSubmit={SubmitForm} className="space-y-4">
          <input
            onChange={(e) => setUserEmail(e.target.value)}
            value={userEmail}
            required
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors cursor-pointer">
            Register
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 font-semibold cursor-pointer">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
