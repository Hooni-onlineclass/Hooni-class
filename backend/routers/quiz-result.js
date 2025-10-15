
const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');

// 결과 저장
router.post('/', async (req, res) => {
  try {
    const result = new QuizResult(req.body);
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: '결과 저장 실패' });
  }
});

// 결과 조회
router.get('/', async (req, res) => {
  try {
    const results = await QuizResult.find().sort({ date: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: '결과 조회 실패' });
  }
});

// 결과 삭제
router.delete('/:id', async (req, res) => {
  try {
    await QuizResult.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: '삭제 실패' });
  }
});

// 결과 수정
router.patch('/:id', async (req, res) => {
  try {
    const updated = await QuizResult.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '수정 실패' });
  }
});



module.exports = router;
