import React from "react";
import { motion } from "framer-motion";

const PasswordStrengthBar = ({ strength }) => {
  const getBarProps = () => {
    switch (strength) {
      case "Weak":
        return { width: "33%", color: "#ef4444" }; // red
      case "Moderate":
        return { width: "66%", color: "#facc15" }; // yellow
      case "Strong":
        return { width: "100%", color: "#22c55e" }; // green
      default:
        return { width: "0%", color: "#374151" }; // gray
    }
  };

  const { width, color } = getBarProps();

  return (
    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width, backgroundColor: color }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default PasswordStrengthBar;
