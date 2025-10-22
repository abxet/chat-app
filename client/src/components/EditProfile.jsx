import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { User, KeyRound, Info } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axiosInstance"; // your axios instance

const EditProfile = ({ currentUser, onClose }) => {
  const [username, setUsername] = useState(currentUser.username || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      // API request to update profile
      const response = await api.put("/user/profile", { username, bio, password });
      if (response?.data?.success) {
        toast.success("Profile updated successfully!");
        onClose && onClose();
      } else {
        toast.error("Failed to update profile. Try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full p-4 bg-gray-800">
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg space-y-4"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center text-teal-500"
        >
          Edit Profile
        </motion.h2>

        {/* Username */}
        <div className="relative">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pr-10 p-3 rounded-lg bg-gray-800 border-b-2 border-teal-600 text-white focus:outline-none focus:border-teal-400 placeholder-gray-400"
          />
          <User
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
          />
        </div>

        {/* Bio */}
        <div className="relative">
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full pr-10 p-3 rounded-lg bg-gray-800 border-b-2 border-teal-600 text-white focus:outline-none focus:border-teal-400 placeholder-gray-400 resize-none"
            rows={3}
          />
          <Info
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pr-10 p-3 rounded-lg bg-gray-800 border-b-2 border-teal-600 text-white focus:outline-none focus:border-teal-400 placeholder-gray-400"
          />
          <KeyRound
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default EditProfile;
