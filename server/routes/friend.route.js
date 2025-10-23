import { Router } from "express";
import {
  getFriends,
  getRequests,
  postRequest,
  acceptRequest,
  rejectRequest,
  searchUsers,
} from "../controllers/friend.controller.js";
import authMiddleware from "../middlewares/auth.js";
// import { verifyToken } from "../middlewares/auth.js"; // optional

const router = Router();

// router.use(verifyToken); // protect routes

router.get("/search", authMiddleware, searchUsers);
router.get("/", authMiddleware, getFriends);
router.get("/requests", authMiddleware, getRequests);
router.post("/requests", authMiddleware, postRequest);
router.put("/requests/:id/accept", authMiddleware, acceptRequest);
router.put("/requests/:id/reject", authMiddleware, rejectRequest);

export default router;
