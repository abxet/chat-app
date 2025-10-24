import React, { useState } from "react";
import LeftBar from "../components/LeftBar";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
}); // connect once

const Chat = () => {
  const [activeSection, setActiveSection] = useState("contacts");
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleSelectContact = (friend) => {
    setSelectedFriend(friend);

    // join room: roomId = sorted combination of user ids
    const currentUserId = localStorage.getItem("userId"); // store userId after login
    const roomId =
      currentUserId < friend._id
        ? `${currentUserId}_${friend._id}`
        : `${friend._id}_${currentUserId}`;

    socket.emit("join_room", roomId);
  };

  return (
    <div className="flex h-screen bg-gray-800">
      <LeftBar setActiveSection={setActiveSection} activeSection={activeSection} />
      <Sidebar activeSection={activeSection} onSelectContact={handleSelectContact} />
      <ChatWindow socket={socket} selectedFriend={selectedFriend} />
    </div>
  );
};

export default Chat;
