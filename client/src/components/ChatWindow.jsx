
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ProfileInfo from "./ProfileInfo";
import api from "../api/axiosInstance.js";
import { encryptMessage, decryptMessage } from "../utils/crypto";
import { useKeyContext } from "../context/KeyContext";
import MessageStatus from "./MessageStatus.jsx";

const ChatWindow = ({ socket, selectedFriend }) => {
  const { user, secretKey, saveUserData } = useKeyContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recipientPublicKey, setRecipientPublicKey] = useState("");
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const scrollRef = useRef();

  const currentUserId = localStorage.getItem("userId");
  // Mark as seen
  useEffect(() => {
  if (!socket || !selectedFriend || !currentUserId) return;

  // Tell backend to mark messages from this friend as seen
  socket.emit("mark as seen", {
    senderId: selectedFriend._id,   // friend is the sender
    receiverId: currentUserId,      // you are the receiver
  });


  socket.on("messages seen", ({ senderId, receiverId }) => {
  setMessages((prev) =>
    prev.map((m) =>
      m.senderId === senderId && m.receiverId === receiverId
        ? { ...m, status: "seen" }
        : m
    )
  );
});
}, [selectedFriend, socket, currentUserId]);

  // handle unfriend
  const handleUnfriend = async (friendId) => {
    try {
      const res = await api.post(`/friends/unfriend/${friendId}`);
      alert(res.data.message || "Unfriended successfully!");
      // Optional: refresh friend list or navigate
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Unable to unfriend");
    }
  };

  // Fetch previous messages when friend changes OLD MESSAGES
  useEffect(() => {
    if (!selectedFriend || !currentUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${currentUserId}/${selectedFriend._id}`);
        const decryptedMsgs = res.data.map(m => {
          const isMyMessage = m.senderId === currentUserId;

          const text = isMyMessage
            ? decryptMessage(m.ciphertext, m.nonce, m.toPublicKey, secretKey)   // you sent it
            : decryptMessage(m.ciphertext, m.nonce, m.fromPublicKey, secretKey) // you received it

          return {
            senderId: m.senderId,
            text: text || "<Failed to decrypt>",
            createdAt: m.createdAt
              ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : null,
          };
        });


        setMessages(decryptedMsgs);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    fetchMessages();
  }, [selectedFriend, secretKey, currentUserId]);

  //  Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join private room & listen for real-time messages NEW MESSAGES
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  useEffect(() => {
    if (!socket || !selectedFriend) return;

    const roomId =
      currentUserId < selectedFriend._id
        ? `${currentUserId}_${selectedFriend._id}`
        : `${selectedFriend._id}_${currentUserId}`;

    socket.emit("join_room", roomId);

    const handleNewMessage = (msg) => {
      if (!secretKey) {
        console.warn("Secret key missing — cannot decrypt yet.");
        return;
      }


      if (
        (msg.senderId === currentUserId && msg.receiverId === selectedFriend._id) ||
        (msg.senderId === selectedFriend._id && msg.receiverId === currentUserId)
      ) {

        const isMyMessage = msg.senderId === currentUserId;

        const decryptedText = isMyMessage
          ? decryptMessage(msg.ciphertext, msg.nonce, msg.toPublicKey, secretKey)
          : decryptMessage(msg.ciphertext, msg.nonce, msg.fromPublicKey, secretKey) || "<Failed to decrypt>";


        setMessages((prev) => [
          ...prev,
          {
            senderId: msg.senderId,
            text: decryptedText,
            createdAt: msg.createdAt
              ? msg.createdAt
              : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    };

    socket.on("chat message", handleNewMessage);


    return () => socket.off("chat message", handleNewMessage);
  }, [socket, selectedFriend, currentUserId, secretKey]);

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  //  Get recipient's public key
  useEffect(() => {
    const fetchRecipientKey = async () => {
      console.log(selectedFriend.username + " is selected");
      if (!selectedFriend?._id) return;
      try {
        const res = await api.get(`/friends/public-key/${selectedFriend._id}`);
        console.log(res.data.publicKey);
        setRecipientPublicKey(res.data.publicKey);
        console.log(recipientPublicKey);
      } catch (err) {
        console.error("Failed to fetch recipient public key:", err);
      }
    };
    fetchRecipientKey();
  }, [selectedFriend]);

  //  Send message
  const sendMessage = async () => {
    if (!input.trim() || !selectedFriend) return;

    const roomId =
      currentUserId < selectedFriend._id
        ? `${currentUserId}_${selectedFriend._id}`
        : `${selectedFriend._id}_${currentUserId}`;
    console.log("Recipient Public Key:", recipientPublicKey);
    console.log("My Secret Key:", secretKey);
    console.log("Decoded lengths →",
      recipientPublicKey ? atob(recipientPublicKey).length : 0,
      secretKey ? atob(secretKey).length : 0
    );

    // Encrypt message
    const { ciphertext, nonce } = encryptMessage(input, recipientPublicKey, secretKey);
    const messageData = {
      roomId,
      senderId: currentUserId,
      receiverId: selectedFriend._id,
      // text: input,
      ciphertext,
      nonce,
      fromPublicKey: user.publicKey,
      toPublicKey: recipientPublicKey,

    };

    try {
      // Emit to server for real-time delivery
      socket.emit("chat message", messageData);

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
    <div className="flex-1 flex flex-col dark:bg-gray-800 bg-gray-300">
      <ChatHeader
        contactName={selectedFriend.username}
        onClick={() => setShowProfile(!showProfile)}
      />

      {showProfile ? (
        <ProfileInfo
          name={selectedFriend.username}
          bio={selectedFriend.profile?.bio || "No bio available"}
          onUnfriend={() => handleUnfriend(selectedFriend._id)}
        />
      ) : (
        <>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-3">
            {messages.map((msg) => {
              // Normalize both IDs to strings and trim
              const senderId = String(msg.senderId || msg.from || "").trim();
              const userId = String(currentUserId || "").trim();

              const isCurrentUser = senderId === userId;

              return (
                <div
                  key={msg._id || msg.id || Math.random()}
                  className={`max-w-xs px-4 py-2 rounded-lg break-words ${isCurrentUser
                    ? "bg-teal-500 text-white self-end rounded-br-none"
                    : "dark:bg-gray-700 bg-white dark:text-white text-gray-600 self-start rounded-bl-none"
                    }`}
                >
                  <div>{msg.text}</div>

                  <MessageStatus
                    isCurrentUser={isCurrentUser}
                    createdAt={msg.createdAt}
                    status={msg.status || "sent"} // optional
                  />

                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>



          {/* Input */}
          <div className="p-4 border-t border-gray-700 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border-b-2 border-teal-600 dark:bg-gray-900 bg-white rounded-t-sm dark:text-white focus:outline-none focus:border-teal-400 placeholder-gray-400"
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
