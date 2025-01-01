const express = require("express");
const mongoose = require("mongoose");
const User = require("./Practice/models/User");
const Craftsman = require("./Practice/models/Craftsman");
const Announcement = require("./Practice/models/Announcement");
const Applicant = require("./Practice/models/Applicant");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import authentication routes
const authRoutes = require("./Practice/routes/auth"); // Adjusted path
const authenticateToken = require("./Practice/middleware/authMiddleware");


// Initialize Express
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.static(path.join(__dirname, 'public')));


// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://AT:AT@craftsmennetwork.psgpn.mongodb.net/?retryWrites=true&w=majority&appName=CraftsmenNetwork"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use("/api", authRoutes);
app.get("/users", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "public", "users.html"));
});


// Use authentication routes
app.use("/auth", authRoutes);
// Serve static files
app.get("/", (req, res) => {
  console.log("Serving home.html");
  res.sendFile(path.join(__dirname, "public", "public", "home.html"));
});

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Welcome, user with ID: ${req.user.id}` });
});

// Example: Creating a new user
app.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body); // Ensure req.body is validated
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
