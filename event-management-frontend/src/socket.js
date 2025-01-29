import { io } from "socket.io-client";

const SOCKET_URL = "https://backend-wn80.onrender.com"; 
const socket = io(SOCKET_URL);

export default socket;
