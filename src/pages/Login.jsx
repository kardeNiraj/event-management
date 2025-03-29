import { FiLock, FiMail } from "react-icons/fi";

import Logo from "../components/Logo";
import { isMobile } from "react-device-detect";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    login(role);
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isMobile ? "bg-white" : "bg-gray-100"
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Logo className={`w-20 h-20`} />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Event Management System
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to your account
        </p>

        <div className="flex justify-center gap-4 mb-4">
          <input
            type="radio"
            name="role"
            value="student"
            checked={role === "student"}
            onChange={() => setRole("student")}
            className="form-radio text-blue-600"
          />
          Student
          <input
            type="radio"
            name="role"
            value="admin"
            checked={role === "admin"}
            onChange={() => setRole("admin")}
            className="form-radio text-blue-600"
          />
          Admin
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:text-blue-500">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
