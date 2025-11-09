// Login.jsx
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { KeyRound, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";
import ThemeToggle from "../components/ThemeToggle";
import { generateKeyPair, encryptPrivateKey, decryptPrivateKey } from "../utils/crypto";

import { useKeyContext } from "../context/KeyContext";


const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, secretKey, saveUserData } = useKeyContext();
  const { updateUserData } = useContext(UserContext);
  //   e.preventDefault();

  //   if (!usernameOrEmail.trim() || !password.trim()) {
  //     toast.error("Please enter both username/email and password.");
  //     return;
  //   }

  //   try {
  //     const response = await api.post("/login", { usernameOrEmail, password });

  //     if (response?.data?.token) {
  //       localStorage.setItem("token", response.data.token);
  //       localStorage.setItem("userId", response.data.user._id);

  //       // Update context
  //       updateUserData(response.data.user || { usernameOrEmail });
  //       let secretKeyBase64;
  //       secretKeyBase64 = await decryptPrivateKey(data.encryptedPrivateKey, password);
  //       saveUserData(username, data.publicKey, secretKeyBase64)
  //       toast.success("Login successful!");
  //       navigate("/chat");
  //     } else {
  //       toast.error("Unexpected server response. Please try again.");
  //     }
  //   } catch (err) {
  //     if (err.response?.status === 401) {
  //       toast.error("Incorrect username, email, or password.");
  //     } else if (err.response?.data?.error) {
  //       toast.error(err.response.data.error);
  //     } else {
  //       toast.error("Unable to connect. Check your internet connection.");
  //     }
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail.trim() || !password.trim()) {
      toast.error("Please enter both username/email and password.");
      return;
    }

    try {
      const response = await api.post("/login", { usernameOrEmail, password });

      const userData = response?.data?.user;
      if (response?.data?.token && userData) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", userData._id);

        // Decrypt private key using password
        const secretKeyBase64 = await decryptPrivateKey(userData.encryptedPrivateKey, password);

        // Save in contexts
        updateUserData(userData);
        saveUserData(userData.username, userData.publicKey, secretKeyBase64);

        toast.success("Login successful!");
        navigate("/chat");
      } else {
        toast.error("Unexpected server response. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
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
    <div className="flex justify-center items-center h-screen relative w-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('src/assets/teal.jpg')" }}

    >
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col w-full max-w-sm p-8 backdrop-blur-3xl dark:bg-gray-800/85 rounded-lg shadow-lg"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-3xl font-bold text-center dark:text-teal-500 text-white"
        >
          Welcome Back!
        </motion.h2>

        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Username or Email"
            className="border-b-2 border-teal-600 bg-transparen dark:text-white text-white w-full pr-10 p-3 outline-none focus:border-teal-400 dark:placeholder-gray-400 placeholder-gray-300"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <User
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none"
          />
        </div>

        <div className="relative mb-4">
          <input
            type="password"
            placeholder="Password"
            className="border-b-2 border-teal-600 bg-transparent text-white dark:text-white w-full pr-10 p-3 outline-none focus:border-teal-400 dark:placeholder-gray-400 placeholder-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <KeyRound
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none"
          />
        </div>

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
      <ThemeToggle />
    </div>
  );
};

export default Login;
