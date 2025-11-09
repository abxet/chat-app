
// components/LeftBar
import { User, Settings, Bell, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

const LeftBar = ({ setActiveSection, activeSection }) => {
  const icons = [
    { id: "contacts", icon: <User size={24} />, title: "Contacts" },
    { id: "notifications", icon: <Bell size={24} />, title: "Notifications" },
    { id: "addUser", icon: <UserPlus size={24} />, title: "Add User" },
    { id: "settings", icon: <Settings size={24} />, title: "Settings" },
  ];

  return (
    <div className="w-16 dark:bg-black/90 bg-gray-100/30 flex flex-col justify-between shadow-md backdrop-blur-3xl">
      <div className="flex-1"></div>

      <div className="flex flex-col space-y-4 mb-4 items-center">
        {icons.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveSection(item.id)}
            className={`p-3 rounded-lg ${
              activeSection === item.id
                ? "bg-teal-500 text-white"
                : "text-gray-400 dark:hover:bg-gray-700 hover:bg-gray-200"
            }`}
            title={item.title}
          >
            {item.icon}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LeftBar;
