export default function registerTypingHandlers(socket, io, userSocketMap) {
  const userId = socket.userId;

  socket.on("typing:start", ({ to }) => {
    if (!to || to === userId) return; // guard for invalid or self
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing:start", { from: userId });
    }
  });

  socket.on("typing:stop", ({ to }) => {
    if (!to || to === userId) return; // guard for invalid or self
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing:stop", { from: userId });
    }
  });
}
