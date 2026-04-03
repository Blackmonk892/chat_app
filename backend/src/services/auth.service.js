// backend/src/services/auth.service.js
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

// Extracted from signup
export const createUser = async (fullName, email, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  return await newUser.save();
};

// Extracted from signup/login
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Extracted from login
export const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Extracted from updateProfile
export const updateUserProfilePic = async (userId, profilePicUrl) => {
  return await User.findByIdAndUpdate(
    userId,
    { profilePic: profilePicUrl },
    { new: true },
  );
};
