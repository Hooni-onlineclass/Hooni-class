

const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

// 등록
router.post('/', async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: '등록 실패' });
  }
});

// 전체 조회
router.get('/', async (req, res) => {
  try {
    const list = await Material.find().sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: '조회 실패' });
  }
});

// 수정
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '수정 실패' });
  }
});

// 삭제
router.delete('/:id', async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: '삭제 실패' });
  }
});

module.exports = router;
