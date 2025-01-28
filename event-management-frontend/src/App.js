import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import EventDashboard from "./EventDashboard";
import "./App.css";
import Register from "./Register";
// import UpdateEventModal from "./UpdateEventModal";
import EventCreation from "./EventCreation";
import Nav from "./Nav";

const App = () => {

  return (
    <Router>
      <Nav/>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route
          path="/events"
          element={token ? <EventDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-event"
          element={token ? <EventCreation /> : <Navigate to="/login" />}
        /> */}
        <Route path="/events" element={<EventDashboard/>}/>
        <Route path="/create-event" element={<EventCreation/>}/>
      </Routes>
    </Router>
  );
};
export default App;
