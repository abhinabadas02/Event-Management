import React, { useState, useEffect } from "react";
import api from "./api";
import s from "./socket";
import CreateEventForm from "./EventCreation";
import { getGuestLoginState, setGuestLoginState } from "./Register";
// const socket = io('http://localhost:5000');
const socket = s;
function EventDashboard() {
  const [events, setEvents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    attendee: "",
  });

  useEffect(() => {
    fetchEvents();

    socket.on("eventUpdated", (updatedEvent) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   fetchEvents();
  // },[]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  const handleEditClick = (event) => {
    setEditMode(true);
    setEditId(event._id);
    setFormData({
      name: event.name,
      description: event.description,
      date: event.date,
      time: event.time,
      attendee: event.attendee,
    });
  };

  // const handleDeleteClick=(ev)=>{
  //   setDeleteId(ev._id)
  // }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = { ...formData };
      const { data } = await api.put(`/events/${editId}`, updatedEvent);
      socket.emit("updateEvent", { eventId: editId, data });
      fetchEvents();
      setEvents(events.map((e) => (e._id === editId ? data : e)));
      setFormData({
        name: "",
        description: "",
        date: "",
        time: "",
        attendee: "",
      });
      alert("Item Updated");
    } catch (err) {
      const con=window.confirm("Please Login Or Register to Update");
      if(con){
        window.location.href="/";
      }
      else{
        window.location.href="/events"
      }
      console.error("Error updating event 400", err);
    }
  };

  const handleDelete = async (id) => {
    // e.preventDefault();
    try {
      await api.delete(`/events/${id}`);
      alert("Event Deleted Successfully");
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      const con=window.confirm("Please Login Or Register to Update");
      if(con){
        window.location.href="/";
      }
      else{
        window.location.href="/events"
      }
      console.error("Error deleting event", err);
    }
  };

  return (
    <div>
      {!editMode ? (
        <CreateEventForm setEvents={setEvents} events={events} />
      ) : (
        <form onSubmit={handleUpdate}>
          <h1>Event Management</h1>
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
            value={formData.attendee}
            onChange={(e) =>
              setFormData({ ...formData, attendee: e.target.value })
            }
          />
          <button type="submit">Update Event</button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      )}
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "start",
          gap: "8vh",
          marginTop: "10vh",
        }}
      >
        {events.map((event) => (
          <li
            style={{
              background: "#f2f2f2",
              width: "35vh",
              alignContent: "center",
              justifyItems: "center",
              height: "35vh",
              borderRadius: "3vh",
            }}
            key={event._id}
          >
            <h2>EVENT NAME: {event.name}</h2>
            <p>Description: {event.description}</p>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
            <p>People Attending: {event.attendee}</p>
            <button
              style={{ width: "9vh", borderRadius: "2vh" }}
              onClick={() => 
                handleEditClick(event)
              }
            >
              Edit
            </button>
            <button
              style={{ marginLeft: "5vh", width: "9vh", borderRadius: "2vh" }}
              onClick={() => handleDelete(event._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* <button onClick={handleLogout}>Logout</button> */}
    </div>
  );
}
export default EventDashboard;
