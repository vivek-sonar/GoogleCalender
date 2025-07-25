import express from "express";
import {
  sendMessage, getMessages,getAllMessagesForUser
} from "../controller/messageController.js";
import Message from "../model/MessageSchema.js";


const msgrouter = express.Router();

msgrouter.post('/sendmsg', sendMessage);
msgrouter.post('/getmsg', getMessages);

msgrouter.get('/allmessages/:userId', getAllMessagesForUser);

// POST /messages/markseen
msgrouter.post("/markseen", async (req, res) => {
  const { senderId, recipientId } = req.body;
  await Message.updateMany(
    { senderId, recipientId, seen: false },
    { $set: { seen: true } }
  );
  res.status(200).send({ message: "Marked as seen" });
});


export default msgrouter;
