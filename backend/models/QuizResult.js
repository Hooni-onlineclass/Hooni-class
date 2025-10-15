
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  name: String,
  score: Number,
  total: Number,
  date: String
});

module.exports = mongoose.model('QuizResult', resultSchema);
