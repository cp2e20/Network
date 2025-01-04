const mongoose = require("mongoose");

const CraftsmanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  skill: { type: String },
  experience: { type: Number }, // Ensure it's a Number type
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Craftsman = mongoose.model("Craftsman", CraftsmanSchema);
module.exports = Craftsman;
