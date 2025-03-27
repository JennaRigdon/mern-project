const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");

// Create a Meeting
router.post("/", async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Meetings
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find().populate("club_id room_id");
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Meetings with Filtering
router.get("/filter", async (req, res) => {
  try {
    const { club, room, startDate, endDate } = req.query;
    let filter = {};

    if (club) filter.club_id = club;
    if (room) filter.room_id = room;
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const meetings = await Meeting.find(filter).populate("club_id room_id");
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a Meeting
router.delete("/:id", async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Meeting deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
