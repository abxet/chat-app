// // import { Server } from 'socket.io';
// // import Message from '../models/Message.model.js';

// // let io;

// // export const initSocket = (server) => {
// //   io = new Server(server, {
// //     cors: {
// //       origin: 'http://localhost:5173',
// //       methods: ['GET', 'POST'],
// //     },
// //   });

// //   io.on('connection', (socket) => {
// //     console.log('New client connected:', socket.id);

// //     // Join a room for private chat
// //     socket.on('join_room', (roomId) => {
// //       socket.join(roomId);
// //       console.log(`Socket ${socket.id} joined room ${roomId}`);
// //     });

// //     // Handle sending a message
// //     socket.on('chat message', async ({ roomId, senderId, receiverId, text }) => {
// //       try {
// //         // Save message to DB
// //         const message = await Message.create({ senderId, receiverId, text });

// //         // Emit to everyone in the room
// //         io.to(roomId).emit('chat message', message);
// //       } catch (err) {
// //         console.error('Error saving message:', err);
// //       }
// //     });

// //     socket.on('disconnect', () => {
// //       console.log('Client disconnected:', socket.id);
// //     });
// //   });

// //   console.log('⚡ Socket.IO initialized');
// // };


// import { Server } from 'socket.io';
// import Message from '../models/Message.model.js';

// let io;

// export const initSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: 'http://localhost:5173',
//       methods: ['GET', 'POST'],
//     },
//   });

//   io.on('connection', (socket) => {
//     console.log('New client connected:', socket.id);

//     // Join a room for private chat
//     socket.on('join_room', (roomId) => {
//       socket.join(roomId);
//       console.log(`Socket ${socket.id} joined room ${roomId}`);
//     });

//     // Handle sending a message
//     socket.on('chat message', async ({ roomId, senderId, receiverId, text }) => {
//       try {
//         // Save message to DB
//         const message = await Message.create({ senderId, receiverId, text });

//         // Emit the message to everyone in the room (sender + receiver)
//         io.to(roomId).emit('chat message', message);
//       } catch (err) {
//         console.error('Error saving message:', err);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('Client disconnected:', socket.id);
//     });
//   });

//   console.log('⚡ Socket.IO initialized');
// };


import { Server } from "socket.io";
import Message from "../models/Message.model.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join a room for private chat
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Listen for messages
    socket.on("chat message", async ({ roomId, senderId, receiverId, text }) => {
      try {
        // Save to DB
        //console log here
        console.log("Message Received:", { roomId, senderId, receiverId, text }); 
        const message = await Message.create({ senderId, receiverId, text });

        // Emit only to users in that room
        io.to(roomId).emit("chat message", message);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  console.log("⚡ Socket.IO initialized");
};
