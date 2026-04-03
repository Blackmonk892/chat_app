// backend/src/app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import messagesRoutes from "./routes/message.routes.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
console.log("CORS Origin:", ENV.CLIENT_URL);

app.use(cookieParser());

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

export default app;
