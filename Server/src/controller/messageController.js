import Message from "../model/MessageSchema.js";

import mongoose from "mongoose";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, recipientId, text } = req.body;

    if (!senderId || !recipientId || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = new Message({
      senderId,
      recipientId,
      text
    });

    const savedMessage = await newMessage.save();
    console.log("Received POST /sendmsg:", req.body);

    res.status(201).json({
      message: "Message sent successfully",
      data: savedMessage
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    // if (!userId || !recipientId) {
    //   return res.status(400).json({ error: "Missing userId or recipientId" });
    // }

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recipientId: recipientId },
        { senderId: recipientId, recipientId: senderId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};











// Get all messages for a user (sent or received)
export const getAllMessagesForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const messages = await Message.find({
      $or: [{ senderId: userId }, { recipientId: userId }]
    }).populate("senderId", "name email") // optional: populate sender info
      .populate("recipientId", "name email") // optional: populate receiver info
      .sort({ createdAt: -1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching all user messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
