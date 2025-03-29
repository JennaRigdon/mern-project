const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  duration: Number,
  description: String,
  club_id: String,
  room_id: String,
  invitedCount: Number,
  acceptedCount: Number
});

module.exports = mongoose.model("Meeting", MeetingSchema);
