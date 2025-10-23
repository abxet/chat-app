import React from "react";
import LeftBar from "../components/LeftBar";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useState } from "react";
const Chat = () => {
const [activeSection, setActiveSection] = useState("contacts");

  return (
 <div className="flex h-screen bg-gray-800">
      <LeftBar setActiveSection={setActiveSection} activeSection={activeSection} />
      <Sidebar activeSection={activeSection} />
      <ChatWindow />
    </div>
  );
}

export default Chat;