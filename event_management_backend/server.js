const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./db");
const User = require("./user");
const Event = require("./event");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
// const PORT = process.env.PORT || 5000;
const JWT_SECRET = "random#secret";
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
// app.use(cors(
//   {
//     methods:["POST","GET","PUT","DELETE"],
//     credentials: true
//   }
// ));
app.use(cors());

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "JWT must be provided" });

  try {
    const decoded = jwt.verify(token, "random#secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

app.post('/guest-login', (req, res) => {
  const token = jwt.sign({ isGuest: true }, JWT_SECRET);
  res.json({ token });
});

// app.post("/guest-login", (req, res) => {
//   try {
//     const token = jwt.sign({isGuest: true}, JWT_SECRET, { expiresIn: "1h" });

//     res.status(200).json({
//       message: "Logged in as guest",
//       token,
//     });
//   } catch (err) {
//     console.error("Error during guest login:", err);
//     res.status(500).json({ error: "Guest login failed" });
//   }
// });

app.post("/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: "Error registering user" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password, isGuest } = req.body;
  try {
    if (isGuest) {
      return res.status(200).json({ token: null, isGuest: true });
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: "Error logging in" });
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await Event.find(req.body);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

app.post("/events", authMiddleware, async (req, res) => {
  const { name, description, date, time, attendee } = req.body;
  if (!name) {
    return res.status(403).json({
      error:
        "Guest users are not allowed to create events. Please register or log in.",
    });
  }
  try {
    const event = new Event({
      name,
      description,
      date,
      time,
      attendee,
      createdBy: req.user.id,
    });
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: "Error creating event" });
  }
});

app.put("/events/:id", authMiddleware, async (req, res) => {
  const { name, description, date, time, attendee } = req.body;
  const username=req.body
  if (!username) {
    return res.status(403).json({
      error:
        "Guest users are not allowed to create events. Please register or log in.",
    });
  }
  try {
    const event = await Event.findByIdAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { name, description, date, time, attendee },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: "Error updating event" });
  }
});


app.delete("/events/:id", authMiddleware, async (req, res) => {
  const username=req.body
  if (!username) {
    return res.status(403).json({
      error:
        "Guest users are not allowed to create events. Please register or log in.",
    });
  }
  try {
    const event = await Event.findByIdAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting event" });
  }
});

// io.on("connection", (socket) => {
//   console.log("A user connected");
//   socket.on("disconnect", () => console.log("A user disconnected"));
// });

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("updateEvent", async (data) => {
    const { eventId, updates } = data;
    const event = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
    });
    if (event) {
      io.emit("eventUpdated", event);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(5000, () => console.log(`Server running on port 5000`));
