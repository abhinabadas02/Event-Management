import React, { useState } from "react";
import service from "./service";
import "./Nav.css";
import { Link } from "react-router-dom";
const Nav = () => {
  const token=localStorage.getItem("token");
  const handleLogout = () => {
    
    const confirmDelete = window.confirm(
      "Are you sure you want to logout this user?"
    );
    if (confirmDelete) {
      service.logout();
      window.location.href = "/";
    }
    else{
      window.location.href="events";
    }
  };
  const handleNav = () => {
    service.logout();
    // window.location.href = "/";

  };
  const handleEvent=(e)=>{
    e.preventDefault();
    if(!token){
      window.location.href="/"
    }
    else{
      window.location.href="/events"
    }
  }
  const handleCreateEvent=(e)=>{
    e.preventDefault();
    if(!token){
      window.location.href="/"
    }
    else{
      window.location.href="/create-event"
    }
  }
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link onClick={handleNav} to="/">Home</Link>
        </li>
        <li>
          <Link onClick={handleNav} to="/login">Login</Link>
        </li>
        <li>
          <Link onClick={handleEvent}>List of Events</Link>
        </li>
        <li>
            <Link onClick={handleCreateEvent}>Configure Your Dream Event</Link>
        </li>

        <li>
          <Link to="/" onClick={handleLogout}>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Nav;
