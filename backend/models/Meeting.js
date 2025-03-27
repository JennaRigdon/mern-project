const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  description: { type: String },
  club_id: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  invitedCount: { type: Number, default: 0 },
  acceptedCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Meeting", MeetingSchema);
