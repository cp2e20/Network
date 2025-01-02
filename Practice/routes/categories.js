const express = require("express");
const Craftsman = require("../models/Craftsman");
const router = express.Router();

// Route to fetch craftsmen by category
router.get("/:category", async (req, res) => {
  const category = req.params.category;
  try {
    const craftsmen = await Craftsman.find({ skill: category });
    res.status(200).json(craftsmen);
  } catch (error) {
    console.error("Error fetching craftsmen by category:", error);
    res.status(500).json({ message: "An error occurred while fetching craftsmen." });
  }
});

module.exports = router;
