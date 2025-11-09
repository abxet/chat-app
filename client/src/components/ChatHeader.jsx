// components/ChatHeader
import React from "react";

const ChatHeader = ({ contactName, onClick }) => {
  const initial = contactName ? contactName.charAt(0).toUpperCase() : "?";

  return (
    <div
      className="flex items-center p-4 bg-gray-200/50 dark:bg-gray-900/40 border-b border-gray-700/20 cursor-pointer backdrop-blur-lg"
      onClick={onClick}
    >
      {/* Profile circle */}
      <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold mr-4">
        {initial}
      </div>

      {/* Contact name */}
      <div className="dark:text-white text-gray-800 font-semibold">{contactName || "Unknown"}</div>
    </div>
  );
};

export default ChatHeader;
