// backend/src/controllers/auth.controller.js
import {
  findUserByEmail,
  createUser,
  validatePassword,
  updateUserProfilePic,
} from "../services/auth.service.js";
import { uploadImage } from "../services/upload.service.js";
import { generateToken } from "../utils/token.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { ENV } from "../config/env.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    console.log("=== Signup Attempt ===");

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const savedUser = await createUser(fullName, email, password);

    if (savedUser) {
      console.log("✅ User saved:", savedUser._id);
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        profilePic: savedUser.profilePic,
      });

      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          ENV.CLIENT_URL,
        );
        console.log("✅ Welcome email sent to:", savedUser.email);
      } catch (error) {
        console.error("⚠️ Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("💥 Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("=== Login Attempt ===");

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await validatePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("💥 Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (_, res) => {
  console.log("=== Logout Attempt ===");
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logout successful" });
};

export const updateProfile = async (req, res) => {
  try {
    console.log("=== Update Profile Attempt ===");
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const userId = req.user._id;
    const imageUrl = await uploadImage(profilePic);
    const updatedUser = await updateUserProfilePic(userId, imageUrl);

    console.log("✅ User profile updated:", updatedUser._id);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("💥 Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
