
import { Server } from "socket.io";
import Message from "../models/Message.model.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🤖 New client connected:", socket.id);

    // Join a room for private chat
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`🤖 Socket ${socket.id} joined room ${roomId}`);
    });

    // Listen for messages
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    socket.on("chat message", async ({ roomId, senderId, receiverId, ciphertext, nonce, fromPublicKey, toPublicKey }) => {
      try {
        console.log("🤖 Message Received:", { roomId, senderId, receiverId, ciphertext, nonce, fromPublicKey, toPublicKey });

        const message = await Message.create({
          senderId,
          receiverId,
          ciphertext,
          nonce,
          fromPublicKey,
          toPublicKey
        });

        const msgData = {
          _id: message._id,
          senderId: message.senderId,
          receiverId: message.receiverId,
          ciphertext: message.ciphertext,
          nonce: message.nonce,
          fromPublicKey: message.fromPublicKey,
          toPublicKey: message.toPublicKey,
          createdAt: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        // io.to(roomId).emit("chat message", message);
        io.to(roomId).emit("chat message", msgData);
      } catch (err) {
        console.error("🔥 Error saving message:", err);
      }
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


    // MARK AS SEEN 

    // ✅ When user opens chat, mark friend’s messages as seen
    socket.on("mark as seen", async ({ senderId, receiverId }) => {
      try {
        // update unseen messages in DB
        await Message.updateMany(
          { senderId, receiverId, status: { $ne: "seen" } },
          { $set: { status: "seen" } }
        );

        // inform both users
        const roomId =
          senderId < receiverId
            ? `${senderId}_${receiverId}`
            : `${receiverId}_${senderId}`;

        io.to(roomId).emit("messages seen", { senderId, receiverId });
        console.log(`✅ Messages seen: ${senderId} → ${receiverId}`);
      } catch (err) {
        console.error("🔥 Error marking as seen:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🤖 Client disconnected:", socket.id);
    });
  });

  console.log("⚡ Socket.IO initialized");
};
