const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  description: { type: String }
});

module.exports = mongoose.model("Club", ClubSchema);
