import React, { useState } from "react";
import api from "./api";
import { Link } from "react-router-dom";
let guestState = null;
let setGuestState = null;
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [isG, setIsG ] = useState();
  

  // const guestLogin = async () => {
  //   const res = await api.post("/guest-login");
  //   console.log(res.data.token);
  //   if (res.data.token) {
  //     alert("Logged in as Guest");
  //     setIsGuest(true);
  //     setIsG(true)
  //     window.location.href="/events";
  //   }
  // };

  const guestLogin = async () => {
    // e.preventDefault()
    try{
      const res = await api.post("/guest-login");
      if (res.data.token) {
        setGuestState(true);
        guestState=true;
        setIsG(true);
        window.location.href="/events";
        alert("Logged in as Guest");
      }
    }
    catch(err){
      console.error("Guest login failed:");
    }
    window.location.href = "/events";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if(isG){
      window.location.href="/events";
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await api.post("/auth/register", { userName, email, password });
      window.location.href = "/login";
    } catch (err) {
      console.error("Registration failed: 500", err.message);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop:"8vh"
      }}
    >
      <div
        style={{
          marginTop: "10vh",
          background: "#cceeff",
          width: "60vh",
          height: "60vh",
          paddingTop: "6vh",
          borderRadius: "3vh",
        }}
      >
        <h1>Register</h1>
        <form style={{ width: "45vh" }} onSubmit={handleRegister}>
          <input
            type="name"
            placeholder="Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Register</button>
          <button onClick={guestLogin}>Login As Guest</button>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export const getGuestLoginState = () => guestState;
export const setGuestLoginState = (value) => {
  if (setGuestState)
    setGuestState(value)
};
export default Register;
