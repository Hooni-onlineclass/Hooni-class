
// models/Notice.js
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  reply: { type: String },
  author: { type: String }
});

module.exports = mongoose.model('Notice', noticeSchema);
