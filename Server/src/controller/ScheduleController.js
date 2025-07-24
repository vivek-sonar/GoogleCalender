import Schedule from "../model/ScheduleSchema.js";
import Event from "../model/EventSchema.js";
import mongoose from "mongoose";
import Notice from "../model/noticeSchema.js";

// Create Schedule
export const createSchedule = async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);

     const { schoolId, userId, eventId, noticeId, startAt, endAt, status, note } = req.body;

    // Only validate fields we currently have
    if (!eventId || !startAt || !endAt) {
      return res
        .status(400)
        .json({ error: "eventId, startAt, and endAt are required." });
    }

    // Check if Event exists
    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({ error: "Event not found" });
    }


    if (noticeId) {
      const noticeExists = await Notice.findById(noticeId);
      if (!noticeExists) {
        return res.status(404).json({ error: "Notice not found" });
      }
    }

    // Validation: endAt must be after startAt
    if (new Date(endAt) <= new Date(startAt)) {
      return res.status(400).json({ error: "endAt must be after startAt." });
    }    



    // Create new schedule (skip schoolId/userId if not present)
     const newSchedule = new Schedule({
      schoolId: schoolId || null,
      userId: userId || null,
      eventId,
      noticeId: noticeId || null,
      startAt,
      endAt,
      status: status || "pending",
      note: note || "",
    });

    const savedSchedule = await newSchedule.save();
    res.status(201).json({
      message: "Schedule created successfully",
      data: savedSchedule,
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ error: "Failed to create schedule" });
  }
};





// ---------------------- VIEW ALL ----------------------
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("eventId", "event_name event_location") // Populate only event info
      .populate("noticeId", "title description")   // Populate notice fields
      .sort({ startAt: 1 });
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Failed to fetch schedules" });
  }
};




// ---------------------- VIEW BY ID ----------------------
export const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params; // Get schedule ID from URL

    const schedule = await Schedule.findById(id)
      // .populate("schoolId", "school_name address") 
      // .populate("userId", "name email")
      .populate("eventId", "event_name event_location start_time end_time")
      .populate("noticeId", "title description");

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json({
      message: "Schedule fetched successfully",
      data: schedule,
    });
  } catch (error) {
    console.error("Error fetching schedule by ID:", error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
};






// ---------------------- UPDATE SCHEDULE ----------------------
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;  // Schedule ID
    const { startAt, endAt, note, status } = req.body;

    // Create an object with only fields provided by the user
    const updateFields = {};
    if (startAt !== undefined) updateFields.startAt = startAt;
    if (endAt !== undefined) updateFields.endAt = endAt;
    if (note !== undefined) updateFields.note = note;
    if (status !== undefined) updateFields.status = status;

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("eventId", "event_name event_location");

    if (!updatedSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json({
      message: "Schedule updated successfully",
      data: updatedSchedule,
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ error: "Failed to update schedule" });
  }
};





// ---------------------- DELETE ----------------------
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId to avoid CastError crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid schedule id." });
    }

    const deletedSchedule = await Schedule.findByIdAndDelete(id);

    if (!deletedSchedule) {
      return res.status(404).json({ error: "Schedule not found." });
    }

    // Optionally return deleted doc; front-end may just need id
    res.status(200).json({
      message: "Schedule deleted successfully",
      id: deletedSchedule._id
    });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({ error: "Failed to delete schedule" });
  }
};