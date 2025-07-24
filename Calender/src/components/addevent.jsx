import { useState } from "react";
import { addEvent } from "../apicall/EventApi";  // Import your API function

const AddEvent = () => {
  const [formData, setFormData] = useState({
    event_name: "",
    event_location: "",
    eventNote: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addEvent(formData);
      alert("Event added successfully!");
      console.log("API Response:", res);

      // Reset form after success
      setFormData({ event_name: "", event_location: "", eventNote: "" });
    } catch (error) {
      console.error("Failed to add event:", error);
      alert("Error adding event. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* <h2>Add Event</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}>
        <input
          type="text"
          name="event_name"
          value={formData.event_name}
          onChange={handleChange}
          placeholder="Event Name"
          required
        />
        <input
          type="text"
          name="event_location"
          value={formData.event_location}
          onChange={handleChange}
          placeholder="Event Location"
          required
        />
        <textarea
          name="eventNote"
          value={formData.eventNote}
          onChange={handleChange}
          placeholder="Event Note"
        ></textarea>
        <button type="submit" style={{ marginTop: "10px" }}>Add Event</button>
      </form> */}
    </div>
  );
};

export default AddEvent;
