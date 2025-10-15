
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  title: String,
  start: Date,
  url: String,
  user: String
});

module.exports = mongoose.model("Schedule", scheduleSchema);
