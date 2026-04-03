// backend/src/sockets/index.js
import { Server } from "socket.io";
import { ENV } from "../config/env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import registerTypingHandlers from "./typing.socket.js";

let io;
const userSocketMap = {};

export const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: [ENV.CLIENT_URL],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("A user connected", socket.user.fullName);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    registerTypingHandlers(socket, io, userSocketMap);

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.user.fullName);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

export { io };
