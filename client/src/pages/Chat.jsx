import React from "react";
import LeftBar from "../components/LeftBar";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useState } from "react";
const Chat = () => {
const [activeSection, setActiveSection] = useState("contacts");

  return (
 <div className="flex h-screen bg-gray-800">
      {/* Left bar */}
      <LeftBar setActiveSection={setActiveSection} activeSection={activeSection} />

      {/* Dynamic sidebar */}
      <Sidebar activeSection={activeSection} />

      {/* Chat messages */}
      <ChatWindow />
    </div>
  );
}

export default Chat;