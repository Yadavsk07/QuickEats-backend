require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");
const { initSocket } = require("./sockets/socket");


const server = http.createServer(app);
initSocket(server);

connectDB();

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
