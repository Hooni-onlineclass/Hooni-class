
// models/Quiz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: Number,
  subject: String, // 선택사항
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
