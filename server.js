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
app.use(express.static(path.join(__dirname, "public")));

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
    // Ensure the request body has valid fields
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ error: "Name, email, and password are required." });
    }

    // Create a new user based on the schema
    const newUser = new User({
      name,
      email,
      password,
      role, // Optional, will default to "craftsman" if not provided
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    res.status(201).send(savedUser); // Respond with the saved user
  } catch (err) {
    console.error("Error during registration:", err);

    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).send({ error: "Email already exists." });
    }

    res.status(500).send({ error: "Internal server error." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
