// routes/message.routes.js
import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { getMessage, getMessages, saveMessage} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:friendId", authMiddleware, getMessage);
router.get("/:userId/:friendId", getMessages);
router.post("/", saveMessage);

export default router;
