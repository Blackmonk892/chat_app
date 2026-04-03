import { deleteMessageById } from "../services/message.service.js";
// DELETE /api/messages/:id
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id;
    const deletedMessage = await deleteMessageById(messageId, userId);
    // Notify both sender and receiver in real-time
    const { senderId, receiverId } = deletedMessage;
    const senderSocketId = getReceiverSocketId(senderId);
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("message:deleted", {
        _id: deletedMessage._id,
      });
    }
    if (receiverSocketId && receiverSocketId !== senderSocketId) {
      io.to(receiverSocketId).emit("message:deleted", {
        _id: deletedMessage._id,
      });
    }
    res
      .status(200)
      .json({ message: "Message deleted", _id: deletedMessage._id });
  } catch (error) {
    if (error.message === "Message not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.startsWith("Unauthorized")) {
      return res.status(403).json({ message: error.message });
    }
    console.error("Error in deleteMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// backend/src/controllers/message.controller.js
import {
  getAllContactsExcept,
  getMessagesBetweenUsers,
  saveMessage,
  getChatPartnersForUser,
} from "../services/message.service.js";
import { uploadImage } from "../services/upload.service.js";
import User from "../models/user.model.js";

// Note: We are importing from sockets/index.js which we will create in the next step!
import { getReceiverSocketId, io } from "../sockets/index.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await getAllContactsExcept(loggedInUserId);
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await getMessagesBetweenUsers(myId, userToChatId);
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    const imageUrl = await uploadImage(image);
    const newMessage = await saveMessage(senderId, receiverId, text, imageUrl);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const chatPartners = await getChatPartnersForUser(loggedInUserId);
    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
