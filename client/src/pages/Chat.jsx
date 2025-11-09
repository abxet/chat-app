
import React, { useState } from "react";
import LeftBar from "../components/LeftBar";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import EditProfile from "../components/EditProfile";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

const Chat = () => {
  const [activeSection, setActiveSection] = useState("contacts");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleSelectContact = (friend) => {
    setSelectedFriend(friend);

    const currentUserId = localStorage.getItem("userId");
    const roomId =
      currentUserId < friend._id
        ? `${currentUserId}_${friend._id}`
        : `${friend._id}_${currentUserId}`;

    socket.emit("join_room", roomId);

    socket.emit("mark as seen", {
      senderId: friend._id,
      receiverId: currentUserId,
    });

  };

  // Handle when Edit Profile is clicked in Settings
  const handleEditProfile = (user) => {
    setCurrentUser(user);
    setEditingProfile(true);
  };

  return (
    <div className="flex h-screen dark:bg-gray-800 bg-gray-500 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('src/assets/teal.jpg')" }}
    >
      <LeftBar setActiveSection={setActiveSection} activeSection={activeSection} />

      <Sidebar
        activeSection={activeSection}
        onSelectContact={handleSelectContact}
        onEditProfile={handleEditProfile}
      />

      {/* Switch between Chat and Edit Profile */}
      {editingProfile ? (
        <EditProfile
          currentUser={currentUser}
          onClose={() => setEditingProfile(false)}
        />
      ) : (
        <ChatWindow socket={socket} selectedFriend={selectedFriend} />
      )}
    </div>
  );
};

export default Chat;
