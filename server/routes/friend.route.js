import { Router } from "express";
import {
  getFriends,
  getRequests,
  postRequest,
  acceptRequest,
  rejectRequest,
  searchUsers,
  unfriendUser,
  getUserPublicKey,
} from "../controllers/friend.controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = Router();

router.get("/search", authMiddleware, searchUsers);
router.get("/", authMiddleware, getFriends);

router.get("/public-key/:userId", authMiddleware, getUserPublicKey);

router.get("/requests", authMiddleware, getRequests);
router.post("/requests", authMiddleware, postRequest);
router.put("/requests/:id/accept", authMiddleware, acceptRequest);
router.put("/requests/:id/reject", authMiddleware, rejectRequest);

// unfriend route
router.post("/unfriend/:friendId", authMiddleware, unfriendUser);

export default router;
