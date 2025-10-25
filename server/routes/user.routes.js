import { Router } from "express";
import { signup, login, getCurrentUser, updateProfile } from "../controllers/user.controller.js";
const router = Router();
import authMiddleware from "../middlewares/auth.js";

// login route
router.post("/login", login);

// signup route
router.post("/signup", signup);


router.get("/me", authMiddleware, getCurrentUser);

router.put('/user/profile', authMiddleware, updateProfile);

// ✅ Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { username, bio, password } = req.body;
    console.log("🟢 Incoming update:", { username, bio, password });

    const updateData = {};

    // ✅ Handle top-level username
    if (username) updateData.username = username;

    // ✅ Handle nested profile fields
    if (bio) updateData["profile.bio"] = bio;

    // ✅ Handle password hashing
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // ✅ Update user
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Updated user:", updatedUser);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});





export default router;