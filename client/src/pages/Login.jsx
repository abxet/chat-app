// Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { KeyRound, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // stop page reload

    if (!usernameOrEmail.trim() || !password.trim()) {
      toast.error("Please enter both username/email and password.");
      return;
    }

    try {
      const response = await api.post("/login", { usernameOrEmail, password });
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!");
        // setTimeout(() => navigate("/chat"), 1000); // redirect after 1 sec
        navigate("/chat"); // redirect to chat page
      } else {
        toast.error("Unexpected server response. Please try again.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Incorrect username, email, or password.");
      } else if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Unable to connect. Check your internet connection.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800 relative">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Login Card */}
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col w-full max-w-sm p-8 bg-gray-900 rounded-lg shadow-lg"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-3xl font-bold text-center text-teal-500"
        >
          Welcome Back!
        </motion.h2>

        {/* Username Input */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Username or Email"
            className="border-b-2 border-teal-600 bg-transparent text-white w-full pr-10 p-3 outline-none focus:border-teal-400 placeholder-gray-400"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <User
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            type="password"
            placeholder="Password"
            className="border-b-2 border-teal-600 bg-transparent text-white w-full pr-10 p-3 outline-none focus:border-teal-400 placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <KeyRound
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg"
          disabled={!usernameOrEmail || !password}
        >
          Login
        </motion.button>

        {/* Signup Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-400 mt-4"
        >
          Don’t have an account?{" "}
          <Link to="/signup" className="text-teal-400 hover:underline">
            Sign Up
          </Link>
        </motion.p>
      </motion.form>
    </div>
  );
};

export default Login;
