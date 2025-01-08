const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  announcementId: { type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }, // Linked to Announcements
  craftsmanEmail: { type: String, ref: "Craftsman" }, // Linked to Craftsmen
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Applicant", applicantSchema);
