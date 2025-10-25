import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        fixed bottom-6 right-6
        z-50
        p-3 rounded-full shadow-lg
        bg-gray-200 dark:bg-gray-700
        text-gray-700 dark:text-yellow-400
        hover:bg-gray-300 dark:hover:bg-gray-600
        transition-colors duration-300
      "
    >
      {theme === "light" ? (
        <Moon size={22} />
      ) : (
        <Sun size={22} />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
