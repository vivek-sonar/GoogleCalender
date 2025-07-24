// src/api/scheduleApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/schedules";

// Create Schedule
export const createSchedule = async (scheduleData) => {
  try {
    const res = await axios.post(`${API_URL}/createschedule`, scheduleData);
    return res.data;
  } catch (error) {
    console.error("Error creating schedule:", error.response?.data || error.message);
    throw error;
  }
};

// Get All Schedules
export const getAllSchedules = async () => {
  try {
    const res = await axios.get(`${API_URL}/getallschedules`);
    return res.data;
  } catch (error) {
    console.error("Error fetching schedules:", error.response?.data || error.message);
    throw error;
  }
};

// Get Schedule By ID
export const getScheduleById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/getschedule/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching schedule by ID:", error.response?.data || error.message);
    throw error;
  }
};

// Update Schedule
export const updateSchedule = async (id, updatedData) => {
  try {
    const res = await axios.put(`${API_URL}/updateschedule/${id}`, updatedData);
    return res.data;
  } catch (error) {
    console.error("Error updating schedule:", error.response?.data || error.message);
    throw error;
  }
};

// Delete Schedule
export const deleteSchedule = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/deleteschedule/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting schedule:", error.response?.data || error.message);
    throw error;
  }
};

