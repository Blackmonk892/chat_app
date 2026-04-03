// backend/src/server.js
import http from "http";
import app from "./app.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initSockets } from "./sockets/index.js";

const PORT = ENV.PORT || 3000;

// Create HTTP server wrapping the Express app
const server = http.createServer(app);

// Initialize Socket.io
initSockets(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
