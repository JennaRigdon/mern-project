const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting"); // Import Mongoose model

// GET all meetings
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find(); // Fetch all meetings from DB
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
