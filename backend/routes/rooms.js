const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define Room Schema
const RoomSchema = new mongoose.Schema({
  building: { type: String, required: true },
  number: { type: String, required: true }
});

const Room = mongoose.model("Room", RoomSchema);

// GET all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new room (for testing)
router.post("/", async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.json(newRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
