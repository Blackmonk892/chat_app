import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "../emails/emailHandler.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    console.log("=== Signup Attempt ===");
    console.log("Incoming body:", { fullName, email });

    if (!fullName || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      console.log("❌ Password too short");
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format");
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      console.log("✅ User saved:", savedUser._id);

      generateToken(savedUser._id, res);
      console.log("✅ JWT cookie set for user:", savedUser._id);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          process.env.CLIENT_URL
        );
        console.log("✅ Welcome email sent to:", savedUser.email);
      } catch (error) {
        console.error("⚠️ Failed to send welcome email:", error);
      }
    } else {
      console.log("❌ Invalid user data");
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
  console.log("Incoming body:", { email });

  if (!email || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("❌ Incorrect password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    console.log("✅ JWT cookie set for user:", user._id);

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
  console.log("✅ JWT cookie cleared");
  res.status(200).json({ message: "Logout successful" });
};

export const updateProfile = async (req, res) => {
  try {
    console.log("=== Update Profile Attempt ===");
    const { profilePic } = req.body;
    if (!profilePic) {
      console.log("❌ No profile pic provided");
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const userId = req.user._id;
    console.log("Incoming userId:", userId);

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    console.log("✅ Cloudinary upload response:", uploadResponse.secure_url);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    console.log("✅ User profile updated:", updatedUser._id);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("💥 Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
