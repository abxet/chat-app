
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Moon, Sun, Edit3, LogOut } from "lucide-react";
import EditProfile from "./EditProfile";
import api from "../api/axiosInstance";
import { useTheme } from "../context/ThemeContext";

const SettingsPanel = ({ setTheme, onLogout, onEditProfile }) => {
  const { theme, toggleTheme } = useTheme();

  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setCurrentUser(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch user info:", err);
      }
    };
    fetchUser();
  }, []);

  // ✅ If editing mode → show EditProfile
  if (isEditing && currentUser) {
    return (
      <EditProfile
        currentUser={currentUser}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">

      <motion.div
        key="settings"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-start p-6 dark:bg-gray-900 h-full dark:text-white text-gray-500 space-y-6"
      >
        {/* settings */}
        <div className="space-y-3 w-full max-w-sm">
          <h1 className="text-xl font-bold text-left  dark:text-white text-gray-400">
            Settings</h1></div>
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-teal-500 dark:bg-teal-500 flex items-center justify-center dark:text-white text-white text-4xl font-bold">
          {currentUser?.username?.[0]?.toUpperCase() || "?"}
        </div>

        {/* Username */}
        <h2 className="text-xl font-semibold">{currentUser?.username}</h2>
        <p className="text-gray-400">{currentUser?.profile?.bio || "No bio available"}</p>

        {/* Buttons */}
        <div className="space-y-3 w-full max-w-sm">
          {/* ✏️ Edit Profile */}
          <button
            // onClick={() => setIsEditing(true)}
            //  onClick={() => onEditProfile(currentUser)}
            onClick={() => onEditProfile && onEditProfile(currentUser)}

            className="flex items-center justify-center w-full py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-white font-semibold space-x-2"
          >
            <Edit3 size={18} />
            <span>Edit Profile</span>
          </button>

          {/* 🌓 Toggle Theme */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="flex items-center justify-center w-full py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold space-x-2"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <span className="flex "><Moon className="text-gray-800 w-10" /> Dark</span>
            ) : (
              <span className="flex ">
              <Sun className="text-yellow-400 w-10" />Sun</span>
            )}
          </motion.button>

          {/* 🚪 Logout */}
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-full py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold space-x-2"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsPanel;
