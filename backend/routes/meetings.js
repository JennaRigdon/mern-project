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
    const { club_id, room_id, startDate } = req.query;
    let query = {};

    if (club_id) query.club_id = new mongoose.Types.ObjectId(club_id);
    if (room_id) query.room_id = new mongoose.Types.ObjectId(room_id);

    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(startDate);
      end.setUTCHours(23, 59, 59, 999);  // Set to end of the day

      query.date = { $gte: start, $lt: end };
    }

    console.log("🚀 Querying with:", JSON.stringify(query, null, 2));

    const meetings = await Meeting.find(query);
    console.log("📌 Filtered results:", meetings);

    const statsResult = await Meeting.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" },
          avgInvited: { $avg: "$invitedCount" },
          avgAccepted: { $avg: "$acceptedCount" },
        },
      },
      {
        $project: {
          _id: 0,
          avgDuration: 1,
          avgInvited: 1,
          avgAccepted: 1,
          attendanceRate: {
            $cond: [
              { $eq: ["$avgInvited", 0] },
              0,
              { $divide: ["$avgAccepted", "$avgInvited"] },
            ],
          },
        },
      },
    ]);

    // If there are no stats, set it to null
    const stats = statsResult.length > 0 ? statsResult[0] : null;

    res.json({ meetings, stats });
    //res.json(meetings);
  } catch (err) {
    console.error("❌ Query Error:", err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const newMeeting = new Meeting({
      title: req.body.title,
      date: new Date(req.body.date),       // Store date as ISODate
      time: req.body.time,
      duration: req.body.duration,
      description: req.body.description,
      club_id: new mongoose.Types.ObjectId(req.body.club_id), // Convert to ObjectId
      room_id: new mongoose.Types.ObjectId(req.body.room_id), // Convert to ObjectId
      invitedCount: req.body.invitedCount,
      acceptedCount: req.body.acceptedCount,
    });
    const savedMeeting = await newMeeting.save();
    res.status(201).json(savedMeeting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ✅ Delete a meeting by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!deletedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        date: new Date(req.body.date), // Ensure proper date format
        time: req.body.time,
        duration: req.body.duration,
        description: req.body.description,
        club_id: new mongoose.Types.ObjectId(req.body.club_id),
        room_id: new mongoose.Types.ObjectId(req.body.room_id),
        invitedCount: req.body.invitedCount,
        acceptedCount: req.body.acceptedCount,
      },
      { new: true }
    );
    if (!updatedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.json(updatedMeeting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
