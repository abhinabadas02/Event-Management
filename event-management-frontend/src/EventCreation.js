import React, { useState } from "react";
import api from "./api";
import { getGuestLoginState, setGuestLoginState } from "./Register";

const EventCreation = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    attendee: "",
  });
  // const token = localStorage.getItem("token");

  const [events, setEvents] = useState("");
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/events", formData);
      setEvents([...events, data]);
      setFormData({
        name: "",
        description: "",
        date: "",
        time: "",
        attendee: "",
      });
      alert("Event Added Successfully");
    } catch (err) {
      const con=window.confirm("Please Login Or Register to Update");
      if(con){
        window.location.href="/";
      }
      else{
        window.location.href="/events"
      }
      console.error("Error creating event", err);
    }
  };

  return (
    <form
      onSubmit={handleCreate}
      style={{ display: "flex", paddingTop: "15vh" }}
    >
      <h1>Configure Your Own Event</h1>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />
      <input
        type="time"
        value={formData.time}
        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
      />
      <input
        type="attendee"
        placeholder="People Attending"
        value={formData.attendee}
        onChange={(e) => setFormData({ ...formData, attendee: e.target.value })}
      />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default EventCreation;
