
const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String, // 파일 링크 또는 경로
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);
