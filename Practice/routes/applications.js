const express = require("express");
const router = express.Router();
const Application = require("../models/Applicant");
const Announcement = require("../models/Announcement");

// Get all applications for a craftsman
router.get("/", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const applications = await Application.find({ craftsmanEmail: email })
      .populate("announcementId")
      .exec();

    res.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Delete an application
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const application = await Application.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Application canceled successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ error: "Failed to delete application" });
  }
});

module.exports = router;
