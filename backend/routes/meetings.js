const express = require("express");
const mongoose = require("mongoose");
const Meeting = require("../models/Meeting");

const router = express.Router();

// ✅ Get all meetings
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (err) {
    console.error("❌ Error fetching meetings:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Filter meetings based on club, room, and date range
router.get("/filter", async (req, res) => {
  try {
    const { club, room, startDate } = req.query;
    let query = {};

    if (club) query.club_id = new mongoose.Types.ObjectId(club);
    if (room) query.room_id = new mongoose.Types.ObjectId(room);

    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(startDate);
      end.setUTCHours(23, 59, 59, 999);  // Set to end of the day

      query.date = { $gte: start, $lt: end };
    }

    console.log("🚀 Querying with:", JSON.stringify(query, null, 2));

    const meetings = await Meeting.find(query);
    console.log("📌 Filtered results:", meetings);

    res.json(meetings);
  } catch (err) {
    console.error("❌ Query Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Add a new meeting
router.post("/", async (req, res) => {
  try {
    const { title, date, time, duration, description, club_id, room_id, invitedCount, acceptedCount } = req.body;

    const newMeeting = new Meeting({
      title,
      date: new Date(date), // Ensure date is stored as `ISODate`
      time,
      duration,
      description,
      club_id: new mongoose.Types.ObjectId(club_id),
      room_id: new mongoose.Types.ObjectId(room_id),
      invitedCount,
      acceptedCount,
    });

    const savedMeeting = await newMeeting.save();
    res.json(savedMeeting);
  } catch (err) {
    console.error("❌ Error adding meeting:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a meeting by ID
router.delete("/:id", async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: "Meeting deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting meeting:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
