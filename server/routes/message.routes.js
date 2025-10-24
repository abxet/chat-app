// routes/message.routes.js
import express from "express";
import Message from "../models/Message.model.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Get messages between current user and friend
router.get("/:friendId", authMiddleware, async (req, res) => {
  const { friendId } = req.params;
  const userId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Get all messages between two users
router.get("/:userId/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 }); // oldest → newest

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Save a new message
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newMessage = await Message.create({ senderId, receiverId, text });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
