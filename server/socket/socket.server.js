import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET','POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    socket.on('chat message', (msg) => {
      // Broadcast message to all connected clients
      io.emit('chat message', msg);
    });
  });

  console.log('⚡ Socket.IO initialized');
};

// Optional: helper function to emit events from backend
export const sendMessageToClients = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};
