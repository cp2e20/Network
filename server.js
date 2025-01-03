const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

// Import Models and Routes
const User = require("./Practice/models/User");
const Craftsman = require("./Practice/models/Craftsman");
const Announcement = require("./Practice/models/Announcement");
const Applicant = require("./Practice/models/Applicant");
const authRoutes = require("./Practice/routes/auth");
const categoriesRoutes = require("./Practice/routes/categories");
const authenticateToken = require("./Practice/middleware/authMiddleware");

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://AT:AT@craftsmennetwork.psgpn.mongodb.net/?retryWrites=true&w=majority&appName=CraftsmenNetwork"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);

// Static File Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/users", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "users.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Protected Route Example
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Welcome, user with ID: ${req.user.id}` });
});

// User Registration Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ error: "Name, email, and password are required." });
    }

    const newUser = new User({
      name,
      email,
      password,
      role, // Optional, defaults to "craftsman"
    });

    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    console.error("Error during registration:", err);

    if (err.code === 11000) {
      return res.status(400).send({ error: "Email already exists." });
    }

    res.status(500).send({ error: "Internal server error." });
  }
});

// Announcements Route
app.post("/api/announcements", async (req, res) => {
  const { title, description, deadline, contactInfo, userId } = req.body;

  try {
    const newAnnouncement = new Announcement({
      title,
      description,
      deadline,
      contactInfo,
      userId,
    });

    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json({
      message: "Announcement created successfully",
      announcement: savedAnnouncement,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create announcement" });
  }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// Fetch all announcements
app.get("/api/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});
