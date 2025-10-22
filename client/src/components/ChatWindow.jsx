import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ProfileInfo from "./ProfileInfo";
import EditProfile from "./EditProfile";

const ChatWindow = ({
  contactName = "Alice",
  contactBio = "Hi, I am Alice!",
  onUnfriend,
}) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "other" },
    { id: 2, text: "Hi there!", sender: "me" },
  ]);
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false); // edit mode
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: "me" }]);
    setInput("");
  };

  const handleUnfriend = (name) => {
    if (onUnfriend) onUnfriend(name);
    setShowProfile(false); 
  };

  const handleSaveProfile = (updatedUser) => {
    // For now, just logging. Later you can update state/backend
    console.log("Profile updated:", updatedUser);
    setIsEditingProfile(false); // exit edit mode
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-800">
      {/* Chat header */}
      <ChatHeader
        contactName={contactName}
        onClick={() => setShowProfile(!showProfile)}
      />

      {/* Content */}
      {isEditingProfile ? (
        <EditProfile
          currentUser={{ username: contactName, bio: contactBio }}
          onClose={() => setIsEditingProfile(false)}
          onSave={handleSaveProfile} // new prop for saving
        />
      ) : showProfile ? (
        <ProfileInfo
          name={contactName}
          bio={contactBio}
          onUnfriend={handleUnfriend}
          onEditProfile={() => setIsEditingProfile(true)} // allow editing
        />
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-xs px-4 py-2 rounded-lg break-words ${
                  msg.sender === "me"
                    ? "bg-teal-500 text-white self-end"
                    : "bg-gray-700 text-white self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Input box */}
          <div className="p-4 border-t border-gray-700 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border-b-2 border-teal-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:border-teal-400 placeholder-gray-400"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg"
            >
              <Send size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
