import Message from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Soft deletes a message for the sender.
 * @param {string} messageId - The ID of the message to delete.
 * @param {string} userId - The ID of the user requesting the deletion.
 * @returns {Promise<Message>} The updated message document.
 */
export const deleteMessageForSelf = async (messageId, userId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.senderId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this message");
  }

  message.isDeleted = true;
  message.deletedAt = new Date();
  return await message.save();
};
