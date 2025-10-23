

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { LogOut } from "lucide-react";


import SearchBar from "./SearchBar";
import SettingsPanel from "./SettingsPanel";
import FriendRequestList from "./FriendRequestList";
import UserSearchPanel from "./UserSearchPanel";

const Sidebar = ({ activeSection, onSelectContact }) => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState("dark");
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data); // assuming res.data = { username: 'John Doe', ... }
      } catch (error) {
        console.error("❌ Failed to load current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);


  // ✅ Fetch user's friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/friends", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(res.data);
      } catch (error) {
        console.error("❌ Failed to load friends:", error);
      }
    };
    fetchFriends();
  }, []);

  // ✅ Fetch friend requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/friends/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriendRequests(res.data);
      } catch (error) {
        console.error("❌ Failed to load friend requests:", error);
      }
    };
    fetchRequests();
  }, []);

  // ✅ Accept friend request
  const handleAccept = async (requestUser) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/friends/requests/${requestUser._id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local UI
      setFriendRequests(friendRequests.filter((r) => r._id !== requestUser._id));
      setFriends([...friends, requestUser]);
    } catch (error) {
      console.error("❌ Error accepting request:", error);
    }
  };

  // ✅ Reject friend request
  const handleReject = async (requestUser) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/friends/requests/${requestUser._id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove request from UI
      setFriendRequests(friendRequests.filter((r) => r._id !== requestUser._id));
    } catch (error) {
      console.error("❌ Error rejecting request:", error);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // ✅ Filter friends by search term
  const filteredFriends = friends.filter((f) =>
    f.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
      <AnimatePresence mode="wait">
        {/* 👥 FRIENDS LIST */}
        {activeSection === "contacts" && (
          <motion.div
            key="contacts"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {filteredFriends.length ? (
              filteredFriends.map((friend) => (
                <div
                  key={friend._id}
                  className="p-2 rounded hover:bg-gray-700 cursor-pointer text-white transition"
                  onClick={() => onSelectContact(friend)}
                >
                  {friend.username}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No friends found</p>
            )}
          </motion.div>
        )}

        {/* 🔔 FRIEND REQUESTS */}
        {activeSection === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FriendRequestList
              requests={friendRequests}
              onAccept={handleAccept}
              onReject={handleReject} // <-- pass the reject handler
            />
          </motion.div>
        )}

        {/* ➕ USER SEARCH PANEL */}
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

        {/* ⚙️ SETTINGS PANEL */}
        {activeSection === "settings" && (
          <SettingsPanel
            theme={theme}
            setTheme={setTheme}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      {/* Current User Section */}
      {/* Current User Section - fixed at bottom */}
      {currentUser && (
        <div className="flex fixed bottom-0 w-58 items-center justify-between bg-gray-800 p-3 mx-0 mt-auto rounded cursor-pointer hover:bg-gray-700 text-white">
          {/* Avatar with initial */}
          <div className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full text-lg font-bold">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          {/* Username */}
          <span className="ml-3 flex-1">{currentUser.username}</span>
          {/* Logout button */}
          {/* Logout icon */}
          <LogOut
            onClick={handleLogout}
            className="w-6 h-6 text-red-500 cursor-pointer hover:text-red-600"
          />

        </div>
      )}

    </div>
  );
};

export default Sidebar;
