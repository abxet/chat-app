import React from "react";
import { Check, CheckCheck } from "lucide-react";

/**
 * MessageStatus Component
 * 
 * Props:
 * - isCurrentUser: boolean (to match styling)
 * - createdAt: ISO string or formatted string
 * - status: "sent" | "delivered" | "seen" (optional)
 */
const MessageStatus = ({ isCurrentUser, createdAt, status }) => {
  if (!createdAt) return null;

  // Convert time if ISO string
  const formattedTime = createdAt.includes("T")
    ? new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : createdAt;

  // choose tick icon based on status
  const getStatusIcon = () => {
    switch (status) {
      case "sent":
        return <Check size={12} className="text-gray-200 ml-1" />;
      case "delivered":
        return <CheckCheck size={12} className="text-gray-200 ml-1" />;
      case "seen":
        return <CheckCheck size={12} className="text-blue-700 ml-1" />;
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
