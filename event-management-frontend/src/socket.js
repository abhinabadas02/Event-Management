import { io } from "socket.io-client";

const SOCKET_URL = "https://backend-80uu.onrender.com"; 
const socket = io(SOCKET_URL);

export default socket;
