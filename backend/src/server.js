import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { ENV } from "./lib/env.js";
import authRoutes from "./routers/auth.route.js";
import messagesRoutes from "./routers/message.route.js";
import { connectDB } from "./lib/db.js";

const app = express();

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
