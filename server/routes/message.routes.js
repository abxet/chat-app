// routes/message.routes.js
import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { getMessage, getMessages, saveMessage} from "../controllers/message.controller.js";

const router = express.Router();

// Get messages between current user and friend
router.get("/:friendId", authMiddleware, getMessage);

// Get all messages between two users
router.get("/:userId/:friendId", getMessages);


// Save a new message
router.post("/", saveMessage);


export default router;
