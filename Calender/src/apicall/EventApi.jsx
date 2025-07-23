import axios from "axios";

const API_URL = "http://localhost:5000/Events";  // Your backend URL

// Add Event
export const addEvent = async (eventData) => {
  try {
    const res = await axios.post(`${API_URL}/add`, eventData);
    return res.data; // Response data
  } catch (error) {
    console.error("Error adding event:", error.response?.data || error.message);
    throw error;
  }
};

// Get All Events
export const getAllEvents = async () => {
  try {
    const res = await axios.get(`${API_URL}/getevents`);
    return res.data;
  } catch (error) {
    console.error("Error fetching events:", error.response?.data || error.message);
    throw error;
  }
};

// Update Event (only event_name, event_location, eventNote)
export const updateEvent = async (id, updatedData) => {
  try {
    const res = await axios.put(`${API_URL}/update/${id}`, updatedData);
    return res.data;
  } catch (error) {
    console.error("Error updating event:", error.response?.data || error.message);
    throw error;
  }
};


// **Delete Event**
export const deleteEvent = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting event:", error.response?.data || error.message);
    throw error;
  }
};