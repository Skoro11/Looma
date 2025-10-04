import { LoginUser } from "../api/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const [userEmail, setUserEmail] = useState("toni@test.com");
  const [userPassword, setUserPassword] = useState("strongpassword");
  const navigate = useNavigate();
  async function SubmitForm(e) {
    e.preventDefault();
    const response = await LoginUser(userEmail, userPassword);

    if (response && response.code === "LOGIN_SUCCESS") {
      navigate("/dashboard"); // SPA-friendly redirect
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

        <p className="text-center text-gray-500 mb-8">
          Sign in to your account
        </p>
        <form onSubmit={SubmitForm}>
          <div className="space-y-4">
            <input
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors cursor-pointer">
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 font-semibold cursor-pointer"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
