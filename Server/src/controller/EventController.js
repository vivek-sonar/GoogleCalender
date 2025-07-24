import Event from "../model/EventSchema.js";
import mongoose from "mongoose";

// Add Event
export const addEvent = async (req, res) => {
  try {
    const { event_name, event_location, eventDate, eventTime, eventNote, schoolId,userId} = req.body;

    // Create a new Event document
    const newEvent = new Event({
      event_name,
      event_location,
      eventDate,
      eventTime,
      eventNote,
      schoolId,
      userId
    });

    // Save to database
    const savedEvent = await newEvent.save();
    res.status(201).json({
      message: "Event added successfully",
      data: savedEvent
    });
  } catch (error) {
    console.error("Error adding event:", error);
    
    res.status(500).json({ error: "Failed to add event" });
  }
};



// View All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 }); // Sort by date ascending
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};





// Get Event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    // Find event by ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};




// Update Event (only event_name, event_location, eventNote)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { event_name, event_location, eventNote } = req.body;

    // Create an object with only the allowed fields
    const updateFields = {};
    if (event_name !== undefined) updateFields.event_name = event_name;
    if (event_location !== undefined) updateFields.event_location = event_location;
    if (eventNote !== undefined) updateFields.eventNote = eventNote;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });

    res.status(200).json({
      message: "Event updated successfully",
      data: updatedEvent
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
};





// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      message: "Event deleted successfully",
      data: deletedEvent
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
};
