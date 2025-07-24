import express from "express";
import {
  sendMessage, getMessages,getAllMessagesForUser
} from "../controller/messageController.js";

const msgrouter = express.Router();

msgrouter.post('/sendmsg', sendMessage);
msgrouter.post('/getmsg', getMessages);

msgrouter.get('/allmessages/:userId', getAllMessagesForUser);

export default msgrouter;
