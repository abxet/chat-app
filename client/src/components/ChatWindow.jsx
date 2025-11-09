
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
  const [messages, setMessages] = useState([]);
  const [recipientPublicKey, setRecipientPublicKey] = useState("");
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const scrollRef = useRef();
  const currentUserId = localStorage.getItem("userId");
  const STATUS_RANK = { sending: 0, error: 0, sent: 1, delivered: 2, seen: 3 };
  const upgrade = (curr, next) => (STATUS_RANK[next] ?? -1) > (STATUS_RANK[curr] ?? -1) ? next : curr;

  // handle unfriend
  const handleUnfriend = async (friendId) => {
    try {
      const res = await api.post(`/friends/unfriend/${friendId}`);
      alert(res.data.message || "Unfriended successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Unable to unfriend");
    }
  };

  useEffect(() => {
    if (selectedFriend) {
      const currentUserId = localStorage.getItem("userId");
      socket.emit("mark as seen", {
        senderId: selectedFriend._id,
        receiverId: currentUserId,
      });
    }
  }, [selectedFriend]);

  // Fetch previous messages when friend changes OLD MESSAGES
  useEffect(() => {
    if (!selectedFriend || !currentUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${currentUserId}/${selectedFriend._id}`);
        const decryptedMsgs = res.data.map(m => {
          const isMyMessage = m.senderId === currentUserId;

          const text = isMyMessage
            ? decryptMessage(m.ciphertext, m.nonce, m.toPublicKey, secretKey)   // u sent 
            : decryptMessage(m.ciphertext, m.nonce, m.fromPublicKey, secretKey) // u received 

          if (!isMyMessage) {
            socket.emit("mark as delivered", { senderId: m.senderId, receiverId: m.receiverId });
          }

          return {
            _id: m._id,
            senderId: m.senderId,
            receiverId: m.receiverId,
            text: text || "<Failed to decrypt>",
            createdAt: m.createdAt
              ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : null,
            status: m.status || "sent",
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
            _id: msg._id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            text: decryptedText,
            createdAt: msg.createdAt
              ? msg.createdAt
              : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        if (!isMyMessage) {
          socket.emit("mark as delivered", { senderId: msg.senderId, receiverId: msg.receiverId });
        }

        if (selectedFriend._id === msg.senderId) {
          socket.emit("mark as seen", { senderId: msg.senderId, receiverId: msg.receiverId });
        }
      }
    };

    socket.on("chat message", handleNewMessage);
    socket.on("message_sent", (msgId) => updateMessageStatus(msgId, "sent"));
    socket.on("delivered", ({ senderId, receiverId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === senderId && msg.receiverId === receiverId
            ? { ...msg, status: upgrade(msg.status, "delivered") }
            : msg
        )
      );
    });
    socket.on("seen", ({ senderId, receiverId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === senderId && msg.receiverId === receiverId
            ? { ...msg, status: upgrade(msg.status, "seen") }
            : msg
        )
      );
    });

    socket.on("message_error", (msgId) => updateMessageStatus(msgId, "error"));
    return () => {
      socket.off("chat message", handleNewMessage);
      socket.off("message_sent");
      socket.off("delivered");
      socket.off("seen");
      socket.off("message_error");

    };
  }, [socket, selectedFriend, currentUserId, secretKey]);

  //  Get recipient's public key
  useEffect(() => {
    const fetchRecipientKey = async () => {
      console.log(selectedFriend.username + " is selected");
      if (!selectedFriend?._id) return;
      try {
        const res = await api.get(`/friends/public-key/${selectedFriend._id}`);
        setRecipientPublicKey(res.data.publicKey);
      } catch (err) {
        console.error("Failed to fetch recipient public key:", err);
      }
    };
    fetchRecipientKey();
  }, [selectedFriend]);

  // update message status
  const updateMessageStatus = (msgId, newStatus) => {
    setMessages((prev) =>
      prev.map((m) =>
        m._id === msgId || m.id === msgId || m.tempId === msgId
          ? { ...m, status: upgrade(m.status, newStatus) }
          : m
      )
    );
  };

  //  Send message
  const sendMessage = async () => {
    if (!input.trim() || !selectedFriend) return;

    const roomId =
      currentUserId < selectedFriend._id
        ? `${currentUserId}_${selectedFriend._id}`
        : `${selectedFriend._id}_${currentUserId}`;

    // Encrypt message
    const { ciphertext, nonce } = encryptMessage(input, recipientPublicKey, secretKey);
    const tempId = Date.now();
    const messageData = {
      roomId,
      senderId: currentUserId,
      receiverId: selectedFriend._id,
      ciphertext,
      nonce,
      fromPublicKey: user.publicKey,
      toPublicKey: recipientPublicKey,
      status: "sending",
    };

    try {
      socket.emit("chat message", { ...messageData, tempId });
      setInput("");
    } catch (err) {
      updateMessageStatus(tempId, "error");
      console.error("Error sending message:", err);
    }
  };

  if (!selectedFriend) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('src/assets/vector.png')" }}
      >
        Select a friend to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col dark:bg-gray-800/70 bg-gray-300/0"
        // style={{ backgroundImage: "url('src/assets/teal.jpg')" }}
    >
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
              const senderId = String(msg.senderId || msg.from || "").trim();
              const userId = String(currentUserId || "").trim();
              const isCurrentUser = senderId === userId;

              return (
                <div
                  key={msg._id || msg.id || msg.tempId}
                  className={`max-w-xs px-4 py-2 rounded-lg break-words ${isCurrentUser
                    ? "bg-teal-500/50 text-white self-end rounded-br-none backdrop-blur-lg"
                    : "dark:bg-gray-700/50 bg-white/50 dark:text-white/50 text-gray-600/50 self-start rounded-bl-none backdrop-blur-lg"
                    }`}
                >
                  <div>{msg.text}</div>
                  <MessageStatus
                    isCurrentUser={isCurrentUser}
                    createdAt={msg.createdAt}
                    status={msg.status || "sent"}
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
