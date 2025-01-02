const express = require("express");
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
    res
      .status(500)
      .json({ message: "An error occurred while fetching users." });
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
    res.status(200).json({ message: "Login successful.", userId: user._id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
});

// Registration route

router.post("/register", async (req, res) => {
  const { name, email, password, role, skill, experience, description } =
    req.body;

  try {
    // Create the user
    const user = new User({ name, email, password, role });
    const savedUser = await user.save();

    // If the user is a craftsman, save additional details in Craftsman collection
    if (role === "craftsman") {
      const craftsman = new Craftsman({
        userId: savedUser._id, // Link the craftsman to the user
        skill,
        experience,
        description,
      });
      await craftsman.save();
    }

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error during registration:", error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists." });
    }

    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});
module.exports = router;
