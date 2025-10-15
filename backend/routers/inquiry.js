
const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// 문의 등록
router.post('/', async (req, res) => {
  try {
    const { text, author } = req.body;
    const inquiry = new Inquiry({ text, author });
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(500).json({ error: '문의 등록 실패' });
  }
});

// 문의 목록 조회
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ date: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: '조회 실패' });
  }
});

// 답변 등록
router.patch('/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    const updated = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { reply, status: '완료' },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '답변 실패' });
  }
});

// 문의 삭제
router.delete('/:id', async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: '삭제 실패' });
  }
});

// 문의 수정
router.patch('/:id', async (req, res) => {
  try {
    const { text } = req.body;
    const updated = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '수정 실패' });
  }
});



module.exports = router;
