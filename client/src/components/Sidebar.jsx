import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SearchBar from "./SearchBar";
import SettingsPanel from "./SettingsPanel";
import FriendRequestList from "./FriendRequestList";
import UserSearchPanel from "./UserSearchPanel";

const Sidebar = ({ activeSection, onSelectContact }) => {
  const allContacts = ["Alice", "Bob", "Charlie", "David"];
  const [friendRequests, setFriendRequests] = useState(["Eve", "Frank"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState("dark");

  const contacts = allContacts.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleAccept = (name) => {
    alert(`Friend request accepted: ${name}`);
    setFriendRequests(friendRequests.filter((r) => r !== name));
    // Optionally, you can add to contacts list here
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 p-4 overflow-y-auto">
      <AnimatePresence exitBeforeEnter>
        {activeSection === "contacts" && (
          <motion.div
            key="contacts"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {contacts.length ? (
              contacts.map((c) => (
                <div
                  key={c}
                  className="p-2 rounded hover:bg-gray-700 cursor-pointer text-white"
                  onClick={() => onSelectContact(c)}
                >
                  {c}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No contacts found</p>
            )}
          </motion.div>
        )}

        {activeSection === "settings" && (
          <SettingsPanel theme={theme} setTheme={setTheme} onLogout={handleLogout} />
        )}

        {activeSection === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FriendRequestList requests={friendRequests} onAccept={handleAccept} />
          </motion.div>
        )}

        {activeSection === "addUser" && (
          <motion.div
            key="addUser"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <UserSearchPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
