const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true }, // Keep as String for simplicity
  time: { type: String, required: true },
  duration: { type: Number, required: false },
  description: String,
  club_id: { type: mongoose.Schema.Types.ObjectId, ref: "Club" }, // Foreign key reference
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  invitedCount: Number,
  acceptedCount: Number
});

module.exports = mongoose.model("Meeting", MeetingSchema);
