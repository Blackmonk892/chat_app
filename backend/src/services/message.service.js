// backend/src/services/message.service.js
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// Extracted from getAllContacts
export const getAllContactsExcept = async (loggedInUserId) => {
  return await User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password");
};

// Extracted from getMessagesByUserId
export const getMessagesBetweenUsers = async (user1Id, user2Id) => {
  return await Message.find({
    $or: [
      { senderId: user1Id, receiverId: user2Id },
      { senderId: user2Id, receiverId: user1Id },
    ],
  });
};

// Extracted from sendMessage
export const saveMessage = async (senderId, receiverId, text, imageUrl) => {
  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });
  return await newMessage.save();
};

// Extracted from getChatPartners
export const getChatPartnersForUser = async (loggedInUserId) => {
  const messages = await Message.find({
    $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
  });

  const chatPartnerIds = [
    ...new Set(
      messages.map((msg) =>
        msg.senderId.toString() === loggedInUserId.toString()
          ? msg.receiverId.toString()
          : msg.senderId.toString(),
      ),
    ),
  ];

  return await User.find({
    _id: { $in: chatPartnerIds },
  }).select("-password");
};
