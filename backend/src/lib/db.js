import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const { MONGODB_URL } = ENV;

    if (!MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined");
    }

    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
