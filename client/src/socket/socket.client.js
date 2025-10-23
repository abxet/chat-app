import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000');

// Connect user when logged in
export const connectUser = (userId) => {
  socket.emit('user_connected', userId);
};

// Send message
export const sendMessage = (senderId, receiverId, text) => {
  socket.emit('send_message', { senderId, receiverId, text });
};

// Listen for incoming messages
export const onMessageReceived = (callback) => {
  socket.on('receive_message', callback);
};


export const registerUser = (userId) => {
  socket.emit("register", userId);
};

export const sendFriendRequestSocket = (senderId, receiverId) => {
  socket.emit("friend_request", { senderId, receiverId });
};

export const notifyFriendAccepted = (senderId, receiverId) => {
  socket.emit("friend_request_accepted", { senderId, receiverId });
};
