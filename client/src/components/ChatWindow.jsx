
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ProfileInfo from "./ProfileInfo";
import EditProfile from "./EditProfile";
import api from "../api/axiosInstance.js";

const ChatWindow = ({ socket, selectedFriend }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const scrollRef = useRef();

  const currentUserId = localStorage.getItem("userId");

  // ✅ Fetch previous messages when friend changes
  useEffect(() => {
    if (!selectedFriend || !currentUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${currentUserId}/${selectedFriend._id}`);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    fetchMessages();
  }, [selectedFriend, currentUserId]);

  // ✅ Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Join private room & listen for real-time messages
  useEffect(() => {
    if (!socket || !selectedFriend) return;

    const roomId =
      currentUserId < selectedFriend._id
        ? `${currentUserId}_${selectedFriend._id}`
        : `${selectedFriend._id}_${currentUserId}`;

    // Join private room
    socket.emit("join_room", roomId);

    // Handle messages from server
    const handleNewMessage = (msg) => {
      // Only add if the message belongs to this conversation
      if (
        (msg.senderId === currentUserId && msg.receiverId === selectedFriend._id) ||
        (msg.senderId === selectedFriend._id && msg.receiverId === currentUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("chat message", handleNewMessage);

    return () => socket.off("chat message", handleNewMessage);
  }, [socket, selectedFriend, currentUserId]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!input.trim() || !selectedFriend) return;

    const roomId =
      currentUserId < selectedFriend._id
        ? `${currentUserId}_${selectedFriend._id}`
        : `${selectedFriend._id}_${currentUserId}`;

    const messageData = {
      roomId,
      senderId: currentUserId,
      receiverId: selectedFriend._id,
      text: input,
    };

    try {
      // Save message in DB
      // await api.post("/messages", messageData);

      // Emit to server for real-time delivery
      socket.emit("chat message", messageData);
      // console.log("Message sent:", messageData);
      // Clear input
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!selectedFriend) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a friend to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-800">
      <ChatHeader
        contactName={selectedFriend.username}
        onClick={() => setShowProfile(!showProfile)}
      />

      {isEditingProfile ? (
        <EditProfile
          currentUser={{ username: selectedFriend.username, bio: selectedFriend.bio }}
          onClose={() => setIsEditingProfile(false)}
        />
      ) : showProfile ? (
        <ProfileInfo
          name={selectedFriend.username}
          bio={selectedFriend.bio}
          onEditProfile={() => setIsEditingProfile(true)}
        />
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg._id || msg.id}
                className={`max-w-xs px-4 py-2 rounded-lg break-words ${
                  msg.senderId === currentUserId
                    ? "bg-teal-500 text-white self-end"
                    : "bg-gray-700 text-white self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border-b-2 border-teal-600 bg-gray-900 text-white focus:outline-none focus:border-teal-400 placeholder-gray-400"
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
