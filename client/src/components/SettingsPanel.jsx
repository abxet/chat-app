import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Edit } from "lucide-react";

const SettingsPanel = ({ theme, setTheme, onLogout, onEditProfile }) => {
  const [isDark, setIsDark] = useState(theme === "dark");

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    setTheme(newTheme);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 text-white"
    >
      {/* Theme Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
        <span>Theme</span>
        <button
          onClick={toggleTheme}
          className={`px-3 py-1 rounded-full font-semibold ${
            isDark ? "bg-teal-500 text-white" : "bg-gray-700 text-gray-200"
          }`}
        >
          {isDark ? "Dark" : "Light"}
        </button>
      </div>

      {/* Edit Profile Button */}
      <button
        onClick={onEditProfile}
        className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-bold flex items-center justify-center space-x-2"
      >
        <Edit size={18} />
        <span>Edit Profile</span>
      </button>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-bold flex items-center justify-center space-x-2"
      >
        <LogOut size={18} />
        <span>Log Out</span>
      </button>
    </motion.div>
  );
};

export default SettingsPanel;
