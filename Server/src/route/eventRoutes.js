import express from "express";
import { addEvent, getAllEvents,updateEvent, deleteEvent} from "../controller/EventController.js";

const router = express.Router();

router.post("/add", addEvent); 
router.get("/getevents", getAllEvents);
router.put("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);

export default router;
