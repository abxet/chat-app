import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/user.routes.js';
import http from 'http';
import { initSocket } from './socket/socket.server.js';
import connectDB from './config/db.js';
import friendsRoutes from './routes/friend.route.js';
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE']
}));

// API routes
app.use('/api', router);
app.use('/api/friends', friendsRoutes);
app.use("/api/messages", messageRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default server;
