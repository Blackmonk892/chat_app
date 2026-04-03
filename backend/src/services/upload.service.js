// backend/src/services/upload.service.js
import cloudinary from "../config/cloudinary.js";

// Extracted from updateProfile and sendMessage
export const uploadImage = async (base64Image) => {
  if (!base64Image) return null;
  const uploadResponse = await cloudinary.uploader.upload(base64Image);
  return uploadResponse.secure_url;
};
