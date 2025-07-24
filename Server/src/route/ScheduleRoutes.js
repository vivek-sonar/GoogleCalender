import express from "express";
import {
  createSchedule,
  getAllSchedules,
  getScheduleById ,
  updateSchedule,
  deleteSchedule
  
} from "../controller/ScheduleController.js";

const schedulerouter = express.Router();

// Create a new schedule
schedulerouter.post("/createschedule", createSchedule);

// View all schedules
schedulerouter.get("/getallschedules", getAllSchedules);
schedulerouter.get("/getschedule/:id", getScheduleById);

// Update a schedule
schedulerouter.put("/updateschedule/:id", updateSchedule);

// Delete a schedule
schedulerouter.delete("/deleteschedule/:id", deleteSchedule);

export default schedulerouter;
