let io;

exports.initSocket = (server) => {
  const socketIO = require("socket.io");

  io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

exports.getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
