import { Router } from "express";
import { signup, login, getCurrentUser, updateProfile } from "../controllers/user.controller.js";
const router = Router();
import authMiddleware from "../middlewares/auth.js";

router.post("/login", login);
router.post("/signup", signup);
router.get("/me", authMiddleware, getCurrentUser);
router.put('/user/profile', authMiddleware, updateProfile);

export default router;