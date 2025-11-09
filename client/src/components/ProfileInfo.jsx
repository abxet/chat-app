
// components/ProfileInfo
import React from "react";

import api from "../api/axiosInstance";

//handle unfriend

const handleUnfriend = async (friendId) => {
  try {
    const res = await api.post(`/users/unfriend/${friendId}`);
    alert(res.data.message || "Unfriended successfully!");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Unable to unfriend");
  }
};


const ProfileInfo = ({ name, bio, onUnfriend, onEditProfile }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex flex-col items-center justify-start p-6 dark:bg-gray-900/50 h-full text-white space-y-6 backdrop-blur-lg">
      {/* Profile Circle */}
      <div className="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center text-white text-4xl font-bold">
        {initial}
      </div>

      {/* Username */}
      <h2 className="text-xl font-semibold">{name}</h2>

      {/* Bio */}
      <p className="text-gray-400 text-center">{bio || "No bio available."}</p>

      {/* Unfriend Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => onUnfriend && onUnfriend(name)}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold"
        >
          Unfriend
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
