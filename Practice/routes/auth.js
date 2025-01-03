const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Craftsman = require("../models/Craftsman");
const router = express.Router();

// Route to fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords from the response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "An error occurred while fetching users." });
  }
});

// Login route with plain-text password comparison
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Compare plain-text passwords
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Password matches
    res.status(200).json({
      message: "Login successful.",
      userId: user._id,
      role: user.role, // Include role for frontend redirection
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
});

// Registration route without password hashing
router.post("/register", async (req, res) => {
  const { name, email, password, role, specialization, experience, bio } = req.body;

  try {
    // Validate role
    const allowedRoles = ["user", "craftsman"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    // Save user data to the User table with plain-text password
    const user = new User({ name, email, password, role });
    const savedUser = await user.save();

    // If the role is Craftsman, handle craftsman-specific data
    if (role === "craftsman") {
      if (!specialization || !experience || !bio) {
        return res.status(400).json({ message: "All Craftsman fields are required." });
      }

      // Convert experience to integer
      const parsedExperience = parseInt(experience, 10);
      if (isNaN(parsedExperience)) {
        return res.status(400).json({ message: "Experience must be a valid number." });
      }

      const craftsman = new Craftsman({
        userId: mongoose.Types.ObjectId(savedUser._id),
        skill: specialization,
        experience: parsedExperience,
        description: bio,
      });

      // Save the craftsman data
      await craftsman.save();
    }

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error.stack || error);
    res.status(500).json({ message: "Registration failed. Please try again later." });
  }
});

// Export the router
module.exports = router;
