
const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// 퀴즈 등록
router.post('/', async (req, res) => {
  try {
    const { question, options, answer, subject } = req.body;
    const quiz = new Quiz({ question, options, answer, subject });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: '퀴즈 등록 실패' });
  }
});

// 퀴즈 전체 조회
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ date: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: '퀴즈 조회 실패' });
  }
});

// 퀴즈 삭제
router.delete('/:id', async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: '삭제 실패' });
  }
});

// 퀴즈 수정
router.patch('/:id', async (req, res) => {
  try {
    const { question, options, answer, subject } = req.body;
    const updated = await Quiz.findByIdAndUpdate(
      req.params.id,
      { question, options, answer, subject },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '수정 실패' });
  }
});

module.exports = router;
