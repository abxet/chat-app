// import { io } from 'socket.io-client';

// import { io } from "socket.io-client";
// const socket = io("http://localhost:5000", {
//   transports: ["websocket", "polling"],
// });


// // Connect user when logged in
// export const connectUser = (userId) => {
//   socket.emit('user_connected', userId);
// };

// // Send message
// export const sendMessage = (senderId, receiverId, text) => {
//   socket.emit('send_message', { senderId, receiverId, text });
// };

// // Listen for incoming messages
// export const onMessageReceived = (callback) => {
//   socket.on('receive_message', callback);
// };


// export const registerUser = (userId) => {
//   socket.emit("register", userId);
// };

// export const sendFriendRequestSocket = (senderId, receiverId) => {
//   socket.emit("friend_request", { senderId, receiverId });
// };

// export const notifyFriendAccepted = (senderId, receiverId) => {
//   socket.emit("friend_request_accepted", { senderId, receiverId });
// };


import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

// Join a chat room
export const joinRoom = (roomId) => {
  socket.emit("join_room", roomId);
};

// Send a message to a room
export const sendMessage = (roomId, senderId, receiverId, text) => {
  socket.emit("chat message", { roomId, senderId, receiverId, text });
};

// Listen for incoming messages
export const onMessageReceived = (callback) => {
  socket.on("chat message", callback);
};

// Remove listener (cleanup)
export const offMessageReceived = (callback) => {
  socket.off("chat message", callback);
};

export default socket;
