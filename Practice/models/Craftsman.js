const mongoose = require("mongoose");

const craftsmanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Linked to Users
  skill: { type: String, required: true },
  experience: { type: Number, required: true }, // Years of experience
  rating: { type: Number, default: 0 },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Craftsman", craftsmanSchema);
