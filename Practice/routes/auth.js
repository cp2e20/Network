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
    // Password matches, include role in the response
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
// Registration route
router.post("/register", async (req, res) => {
  const { name, email, password, role, specialization, experience, bio } =
    req.body;

  try {
    // Save user data to the User table
    const user = new User({ name, email, password, role });

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    const savedUser = await user.save();

    // If the role is Craftsman, handle craftsman-specific data
    if (role === "craftsman") {
      if (!specialization || !experience || !bio) {
        return res
          .status(400)
          .json({ message: "All Craftsman fields are required." });
      }

      const craftsman = new Craftsman({
        userId: mongoose.Types.ObjectId(savedUser._id),
        skill: specialization,
        experience: parseInt(experience, 10),
        description: bio,
      });

      await craftsman.save();
    }

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "Registration failed. Please try again later." });
  }
});

// Export the router
module.exports = router;
