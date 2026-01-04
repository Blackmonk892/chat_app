import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    console.log("=== ProtectRoute Middleware Triggered ===");
    console.log("Incoming cookies:", req.cookies);

    const token = req.cookies.jwt;
    if (!token) {
      console.log("❌ No JWT cookie found");
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    console.log("✅ JWT cookie found:", token);

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
      console.log("✅ Token decoded successfully:", decoded);
    } catch (err) {
      console.log("❌ JWT verification failed:", err.message);
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("❌ User not found for ID:", decoded.userId);
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    console.log("✅ User found:", user._id);
    req.user = user;
    next();
  } catch (error) {
    console.log("💥 Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
