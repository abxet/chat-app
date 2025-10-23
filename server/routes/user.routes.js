import { Router } from "express";
import { signup, login, getCurrentUser } from "../controllers/user.controller.js";
const router = Router();
import authMiddleware from "../middlewares/auth.js";

// login route
router.post("/login", login);

// signup route
router.post("/signup", signup);


router.get("/me", authMiddleware, getCurrentUser);

export default router;