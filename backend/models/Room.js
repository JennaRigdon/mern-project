const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  building: { type: String, required: true },
  number: { type: String, required: true },
  maxCapacity: { type: Number, required: true }
});

module.exports = mongoose.model("Room", RoomSchema);
