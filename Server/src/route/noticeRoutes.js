import express from "express";
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} from "../controller/noticeController.js";

const noticerouter = express.Router();

noticerouter.post("/createnotice", createNotice);
noticerouter.get("/getallnotices", getAllNotices);
noticerouter.get("/getnotice/:id", getNoticeById);
noticerouter.put("/updatenotice/:id", updateNotice);
noticerouter.delete("/deletenotice/:id", deleteNotice);

export default noticerouter;
