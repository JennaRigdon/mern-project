const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define Club Schema
const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Club = mongoose.model("Club", ClubSchema);

// GET all clubs
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new club (for testing)
router.post("/", async (req, res) => {
  try {
    const newClub = new Club(req.body);
    await newClub.save();
    res.json(newClub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
