import React from "react";
import { Circle, CircleCheck, Clock, CircleAlert } from "lucide-react";

const MessageStatus = ({ isCurrentUser, createdAt, status }) => {
  if (!createdAt) return null;

  // Convert time if ISO string
  const formattedTime = createdAt.includes("T")
    ? new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : createdAt;

  // choose tick icon based on status
  const getStatusIcon = () => {
    switch (status) {
      case "sending":
       return <Clock size={12} className="text-gray-200 ml-1" />;
      case "sent":
        return <Circle size={12} className="text-gray-200 ml-1" />;
      case "delivered":
        return <CircleCheck size={12} className="text-gray-200 ml-1" />;
      case "seen":
        return <CircleCheck size={12} className="text-blue-700 ml-1" />;
      case "error":
        return <CircleAlert size={12} className="text-red-400 ml-1" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`text-xs mt-1 text-right break-words flex items-center justify-end ${
        isCurrentUser ? "text-white" : "dark:text-white text-gray-600"
      }`}
    >
      <span>{formattedTime}</span>
      {isCurrentUser && getStatusIcon()}
    </div>
  );
};

export default MessageStatus;
