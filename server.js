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
  res.sendFile(path.join(__dirname, "public", "public", "home.html"));
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
  const { name, email, password, role, specialization, experience, bio } =
    req.body;

  try {
    // Check if the email already exists in the User table
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists in User table." });
    }

    if (role === "user") {
      // Save user data to the User table
      const user = new User({ name, email, password, role });
      await user.save();
      return res.status(201).json({ message: "User registration successful." });
    }

    if (role === "craftsman") {
      // Validate Craftsman-specific fields
      if (!specialization || !experience || !bio) {
        return res
          .status(400)
          .json({ message: "All Craftsman-specific fields are required." });
      }

      // Save Craftsman data to the Craftsman table
      const craftsman = new Craftsman({
        name,
        email,
        password,
        skill: specialization,
        experience: parseInt(experience, 10),
        description: bio,
      });
      await craftsman.save();

      // Save craftsman data to the User table as well
      const user = new User({ name, email, password, role });
      await user.save();

      return res
        .status(201)
        .json({ message: "Craftsman registration successful." });
    }

    // If role is invalid
    return res.status(400).json({ message: "Invalid role specified." });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "Registration failed. Please try again later." });
  }
});

// Announcements Route
app.post("/api/announcements", async (req, res) => {
  const {
    title,
    description,
    location,
    payment,
    deadline,
    contactInfo,
    userId,
  } = req.body;

  try {
    const newAnnouncement = new Announcement({
      title,
      description,
      location,
      payment,
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

// Fetch all announcements
app.get("/api/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});
const moment = require("moment");

// Dashboard Metrics Route
app.get("/api/dashboard", async (req, res) => {
  try {
    // Count the total number of announcements
    const totalApplications = await Announcement.countDocuments();

    // Count the number of jobs available (deadline does not exceed today)
    const today = moment().startOf("day");
    const jobsAvailable = await Announcement.countDocuments({
      deadline: { $gte: today.toDate() },
    });

    // Return the metrics
    res.status(200).json({
      totalApplications,
      jobsApplied: 8, // Placeholder for "Jobs Applied" (to be implemented later)
      jobsAvailable,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Failed to fetch dashboard metrics" });
  }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
