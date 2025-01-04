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
  const { name, email, password, role, specialization, experience, bio } =
    req.body;

  try {
    // Validate role
    const allowedRoles = ["user", "craftsman"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Check if the email already exists in the User table
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Create a new user entry for all roles
    const newUser = new User({ name, email, password, role });
    const savedUser = await newUser.save();

    // Additional handling for craftsmen
    if (role === "craftsman") {
      // Validate Craftsman-specific fields
      if (!specialization || !experience || !bio) {
        return res
          .status(400)
          .json({ message: "All Craftsman-specific fields are required." });
      }

      // Parse experience to integer
      const parsedExperience = parseInt(experience, 10);
      if (isNaN(parsedExperience)) {
        return res
          .status(400)
          .json({ message: "Experience must be a valid number." });
      }

      // Save Craftsman-specific data
      const craftsman = new Craftsman({
        userId: mongoose.Types.ObjectId(savedUser._id), // Link to the user table
        skill: specialization,
        experience: parsedExperience,
        description: bio,
      });
      await craftsman.save();
    }

    // Respond with success
    res.status(201).json({
      message:
        role === "craftsman"
          ? "Craftsman registration successful."
          : "User registration successful.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "Registration failed. Please try again later." });
  }
});

// Export the router
module.exports = router;
