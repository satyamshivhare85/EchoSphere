import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Map to track online users
export const userSocketMap = {};

// Get socketId of a user
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId] || null;
};

// Socket.IO connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  

  if (userId) {
    userSocketMap[userId] = socket.id;
       socket.join(userId);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log(`User connected: ${userId}`);
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log(`User disconnected: ${userId}`);
    }
  });
});

export { app, server, io };
