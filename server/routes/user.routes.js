import { Router } from "express";
import { signup, login } from "../controllers/user.controller.js";
const router = Router();

// login route
router.post("/login", login);

// signup route
router.post("/signup", signup);

export default router;