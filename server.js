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

const applicationRoutes = require("./Practice/routes/applications");
const authRoutes = require("./Practice/routes/auth");
const categoriesRoutes = require("./Practice/routes/categories");
const authenticateToken = require("./Practice/middleware/authMiddleware");

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Serve static files from the 'public' directory
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
  res.sendFile(path.join(__dirname, "public", "public", "HOME1.html"));
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "public", "home.html"));
});

app.get("/users", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "public", "users.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "public", "dashboard.html"));
});

// Ensure craftsman dashboard is routed
app.get("/Cdashborad", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "public", "Cdashborad.html"));
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

// Apply for Job

app.post("/api/apply", async (req, res) => {
  const { jobId, message, craftsmanEmail } = req.body;

  // Validate input
  if (!jobId || !message || !craftsmanEmail) {
    return res
      .status(400)
      .json({ error: "Job ID, message, and craftsman email are required." });
  }

  try {
    // Since the craftsman is logged in, we trust that the email is valid
    // Directly create the application without checking the database
    const applicant = await Applicant.create({
      announcementId: jobId,
      craftsmanEmail, // Save the email directly
      message,
    });

    res
      .status(201)
      .json({ success: true, message: "Application submitted successfully." });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: "Failed to submit application." });
  }
});

app.get("/api/applicants", async (req, res) => {
  const { announcementId } = req.query;

  if (!announcementId) {
    return res.status(400).json({ error: "Announcement ID is required." });
  }

  try {
    const applicants = await Applicant.find({ announcementId }).lean();
    res.status(200).json(applicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ error: "Failed to fetch applicants." });
  }
});
app.get("/api/craftsman", async (req, res) => {
  const { email } = req.query; // Retrieve email from query parameters
  console.log("Email received in backend:", email); // Debug log

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const craftsman = await Craftsman.findOne({ email }).lean(); // Use lean() for plain JS object
    if (!craftsman) {
      return res.status(404).json({ error: "Craftsman not found." });
    }
    res.status(200).json(craftsman);
  } catch (err) {
    console.error("Error fetching craftsman:", err);
    res.status(500).json({ error: "Failed to fetch craftsman." });
  }
});

app.get("/api/craftsmen/:specialization", async (req, res) => {
  const { specialization } = req.params;
  try {
    const craftsmen = await Craftsman.find({ skill: specialization });
    res.json(craftsmen);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
app.get("/api/craftsman/:id", async (req, res) => {
  const { id } = req.params; // Replace with email if using email as identifier
  try {
    const craftsman = await Craftsman.findById(id); // Or use findOne({ email: id })
    if (!craftsman) {
      return res.status(404).json({ message: "Craftsman not found" });
    }
    res.json(craftsman);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/api/announcements/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Received ID for deletion: ${id}`);

  // Validate ID format
  const mongoose = require("mongoose");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid announcement ID" });
  }

  try {
    const result = await Announcement.findByIdAndDelete(id);
    if (!result) {
      console.log("Announcement not found");
      return res.status(404).json({ error: "Announcement not found" });
    }
    console.log("Deleted Announcement:", result);
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// Endpoint to fetch applications for the logged-in craftsman
app.get("/applications", async (req, res) => {
  const craftsmanEmail = req.query.email; // Email from client query
  if (!craftsmanEmail) {
    return res.status(400).json({ error: "Craftsman email is required." });
  }

  try {
    // Find applications for the craftsman and populate related announcements
    const applications = await Applicant.find({ craftsmanEmail })
      .populate("announcementId", "title deadline contactInfo")
      .exec();

    res.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching applications." });
  }
});

// Endpoint to cancel an application
app.delete("/api/applicants/:id", async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  const mongoose = require("mongoose");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid applicant ID" });
  }

  try {
    const result = await Applicant.findByIdAndDelete(id);
    if (!result) {
      console.log("Applicant not found");
      return res.status(404).json({ error: "Applicant not found" });
    }
    console.log("Deleted Applicant:", result);
    res.status(200).json({ message: "Applicant deleted successfully" });
  } catch (error) {
    console.error("Error deleting applicant:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// Get the count of craftsmen for each specialization
app.get("/craftsmen/count", async (req, res) => {
  try {
    const specializations = [
      "Carpenter",
      "Blacksmith",
      "Tailor",
      "Painter",
      "Plumber",
      "Electrician",
      "Stonemason",
      "Glassblower",
      "Shoemaker",
      "Jeweler",
      "Potter",
      "Leatherworker",
      "Welder",
      "Cabinetmaker",
      "Engraver",
      "Weaver",
      "Metalworker",
      "Stone Carver",
      "Bookbinder",
      "Calligrapher",
    ];

    const counts = await Promise.all(
      specializations.map(async (specialization) => {
        const count = await Craftsman.countDocuments({ skill: specialization });
        return { specialization, count };
      })
    );

    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch counts" });
  }
});

// Routes
app.use("/api/applications", applicationRoutes);

//job applied for craftmen;
app.get("/api/dashboard/jobs-applied", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Craftsman email is required." });
  }

  try {
    const jobsApplied = await Applicant.countDocuments({
      craftsmanEmail: email,
    });
    res.status(200).json({ jobsApplied });
  } catch (error) {
    console.error("Error fetching jobs applied count:", error);
    res.status(500).json({ error: "Failed to fetch jobs applied count." });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
