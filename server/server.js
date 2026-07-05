import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import connectDB from "./config/db.js";
import router from "./routes/user.routes.js";
import friendsRoutes from "./routes/friend.route.js";
import messageRoutes from "./routes/message.routes.js";
import { initSocket } from "./socket/socket.server.js";

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chat Server is running 🚀",
  });
});

// Routes
app.use("/api", router);
app.use("/api/friends", friendsRoutes);
app.use("/api/messages", messageRoutes);

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default server;