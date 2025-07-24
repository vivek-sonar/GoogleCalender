// src/api/noticeApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/notices";

// Create Notice
export const createNotice = async (noticeData) => {
  try {
    const res = await axios.post(`${API_URL}/createnotice`, noticeData);
    return res.data;
  } catch (error) {
    console.error("Error creating notice:", error.response?.data || error.message);
    throw error;
  }
};

// Get All Notices
export const getAllNotices = async () => {
  try {
    const res = await axios.get(`${API_URL}/getallnotices`);
    return res.data;
  } catch (error) {
    console.error("Error fetching notices:", error.response?.data || error.message);
    throw error;
  }
};

// Get Notice By ID
export const getNoticeById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/getnotice/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching notice by ID:", error.response?.data || error.message);
    throw error;
  }
};

// Update Notice
export const updateNotice = async (id, updatedData) => {
  try {
    const res = await axios.put(`${API_URL}/updatenotice/${id}`, updatedData);
    return res.data;
  } catch (error) {
    console.error("Error updating notice:", error.response?.data || error.message);
    throw error;
  }
};

// Delete Notice
export const deleteNotice = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/deletenotice/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting notice:", error.response?.data || error.message);
    throw error;
  }
};
