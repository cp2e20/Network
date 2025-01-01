const express = require("express");
const mongoose = require("mongoose");
const User = require("./Practice/models/User");
const Craftsman = require("./Practice/models/Craftsman");
const Announcement = require("./Practice/models/Announcement");
const Applicant = require("./Practice/models/Applicant");
const path = require("path");

// Initialize Express
const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://AT:AT@craftsmennetwork.psgpn.mongodb.net/?retryWrites=true&w=majority&appName=CraftsmenNetwork"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Serve static files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "public", "index.html"));
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
  console.log(`Server running on port ${PORT}`);
});
