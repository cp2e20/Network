const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: { type: Date, required: true },
  contactInfo: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Linked to Users
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Announcement", announcementSchema);
