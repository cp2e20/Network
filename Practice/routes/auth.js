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
  const { name, email, password, role, specialization, experience, bio } =
    req.body;

  try {
    // Save user
    const user = new User({ name, email, password, role });
    await user.save();

    // Save craftsman-specific data if applicable
    if (role === "craftsman") {
      const craftsman = new Craftsman({
        userId: user._id, // Link craftsman to user
        skill: specialization, // Map "specialization" from frontend to "skill" in schema
        experience: parseInt(experience, 10), // Convert experience to a number
        description: bio, // Map "bio" from frontend to "description" in schema
      });

      await craftsman.save();
    }

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// Export the router
module.exports = router;
