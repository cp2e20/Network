const mongoose = require("mongoose");

const CraftsmanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skill: { type: String, required: true },
  experience: { type: Number, required: true }, // Ensure it's a Number type
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Craftsman = mongoose.model('Craftsman', CraftsmanSchema);
module.exports = Craftsman;
