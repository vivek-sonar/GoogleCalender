import mongoose from "mongoose";
import Notice from "../model/noticeSchema.js";
import Event from "../model/EventSchema.js";
import Schedule from "../model/ScheduleSchema.js";

/**
 * Helper: validate HH:mm format (24h)
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const isValidTime = (t) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(t || "");
const isEndAfterStart = (start, end) => end > start; // HH:mm lexicographic works

/**
 * CREATE Notice
 */
export const createNotice = async (req, res) => {
  try {
    const { title, message, startTime, endTime, schoolId, userId, eventId, scheduleId } = req.body;

    // Required fields
    if (!title || !message || !startTime || !endTime) {
      return res.status(400).json({ error: "title, message, startTime, endTime are required." });
    }

    // Time format check
    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      return res.status(400).json({ error: "startTime and endTime must be HH:mm (24h)." });
    }

    // Optional: ensure endTime > startTime (string compare works if both HH:mm)
    if (endTime <= startTime) {
      return res.status(400).json({ error: "endTime must be later than startTime." });
    }

    // Validate refs if provided
    if (eventId && !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid eventId." });
    }
    if (scheduleId && !mongoose.Types.ObjectId.isValid(scheduleId)) {
      return res.status(400).json({ error: "Invalid scheduleId." });
    }
    if (schoolId && !mongoose.Types.ObjectId.isValid(schoolId)) {
      return res.status(400).json({ error: "Invalid schoolId." });
    }
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId." });
    }

    // Check existence where meaningful (optional; skip if you want speed)
    if (eventId) {
      const ev = await Event.findById(eventId);
      if (!ev) return res.status(404).json({ error: "Event not found." });
    }
    if (scheduleId) {
      const sch = await Schedule.findById(scheduleId);
      if (!sch) return res.status(404).json({ error: "Schedule not found." });
    }

    const notice = new Notice({
      title,
      message,
      startTime,
      endTime,
      schoolId: schoolId || null,
      userId: userId || null,
      eventId: eventId || null,
      scheduleId: scheduleId || null,
    });

    const saved = await notice.save();
    res.status(201).json({ message: "Notice created successfully", data: saved });
  } catch (err) {
    console.error("Error creating notice:", err);
    res.status(500).json({ error: "Failed to create notice" });
  }
};

/**
 * GET ALL Notices
 * Optional query filters: schoolId, userId, eventId, scheduleId
 */
export const getAllNotices = async (req, res) => {
  try {
    const { schoolId, userId, eventId, scheduleId } = req.query;
    const filter = {};

    if (schoolId && mongoose.Types.ObjectId.isValid(schoolId)) filter.schoolId = schoolId;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) filter.userId = userId;
    if (eventId && mongoose.Types.ObjectId.isValid(eventId)) filter.eventId = eventId;
    if (scheduleId && mongoose.Types.ObjectId.isValid(scheduleId)) filter.scheduleId = scheduleId;

    const notices = await Notice.find(filter)
      .populate("eventId", "event_name event_location")
      .populate("scheduleId", "startAt endAt status")
    //   .populate("schoolId", "schoolName")
    //   .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(notices);
  } catch (err) {
    console.error("Error fetching notices:", err);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
};

/**
 * GET Notice by ID
 */
export const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid notice id." });

    const notice = await Notice.findById(id)
      .populate("eventId", "event_name event_location")
      .populate("scheduleId", "startAt endAt status")
    //   .populate("schoolId", "schoolName")
    //   .populate("userId", "name email");

    if (!notice) return res.status(404).json({ error: "Notice not found." });

    res.status(200).json(notice);
  } catch (err) {
    console.error("Error fetching notice:", err);
    res.status(500).json({ error: "Failed to fetch notice" });
  }
};

/**
 * UPDATE Notice
 * You can update: title, message, startTime, endTime, eventId, scheduleId, status
 */
export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid notice id." });

    let {
      title,
      message,
      startTime,
      endTime,
      eventId,
      scheduleId,
      schoolId,
      userId,
      status,
    } = req.body;

    const updateFields = {};

    if (title !== undefined) updateFields.title = title;
    if (message !== undefined) updateFields.message = message;

    if (startTime !== undefined) {
      if (!isValidTime(startTime)) return res.status(400).json({ error: "Invalid startTime (HH:mm)." });
      updateFields.startTime = startTime;
    }
    if (endTime !== undefined) {
      if (!isValidTime(endTime)) return res.status(400).json({ error: "Invalid endTime (HH:mm)." });
      updateFields.endTime = endTime;
    }

    // Agar dono bheje gaye to compare; agar ek bhi missing hai to skip comparison
    if (startTime !== undefined && endTime !== undefined && !isEndAfterStart(startTime, endTime)) {
      return res.status(400).json({ error: "endTime must be later than startTime." });
    }

    // Refs (optional)
    if (eventId !== undefined) {
      if (eventId && !isValidObjectId(eventId)) return res.status(400).json({ error: "Invalid eventId." });
      // existence check optional
      updateFields.eventId = eventId || null;
    }
    if (scheduleId !== undefined) {
      if (scheduleId && !isValidObjectId(scheduleId)) return res.status(400).json({ error: "Invalid scheduleId." });
      updateFields.scheduleId = scheduleId || null;
    }
    // We'll accept schoolId/userId but not populate (models missing)
    if (schoolId !== undefined) {
      if (schoolId && !isValidObjectId(schoolId)) return res.status(400).json({ error: "Invalid schoolId." });
      updateFields.schoolId = schoolId || null;
    }
    if (userId !== undefined) {
      if (userId && !isValidObjectId(userId)) return res.status(400).json({ error: "Invalid userId." });
      updateFields.userId = userId || null;
    }

    if (status !== undefined) updateFields.status = status; // enum handled by schema (add if added)

    const updated = await Notice.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .populate("eventId", "event_name event_location")
      .populate("scheduleId", "startAt endAt status");
      // add school/user populate later

    if (!updated) return res.status(404).json({ error: "Notice not found." });

    res.status(200).json({ message: "Notice updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating notice:", err);
    res.status(500).json({ error: "Failed to update notice" });
  }
};

/**
 * DELETE Notice
 */
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid notice id." });

    const deleted = await Notice.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Notice not found." });

    res.status(200).json({ message: "Notice deleted successfully", id: deleted._id });
  } catch (err) {
    console.error("Error deleting notice:", err);
    res.status(500).json({ error: "Failed to delete notice" });
  }
};
