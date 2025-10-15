
const express = require("express");
const router = express.Router();
const VideoClass = require("../models/VideoClass");

// 🔹 수업방 등록 또는 업데이트 (link 기준)
router.post("/", async (req, res) => {
  try {
    const { link } = req.body;

    if (!link) {
      return res.status(400).json({ error: "link 값이 필요합니다." });
    }

    const updated = await VideoClass.findOneAndUpdate(
      { link },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "수업방 저장 실패" });
  }
});

// 🔹 전체 수업방 조회 (필터: createdBy, students, 날짜 등)
router.get("/", async (req, res) => {
  try {
    const { createdBy, student, fromDate, toDate } = req.query;
    const filter = {};

    if (createdBy) filter.createdBy = createdBy;

    if (student) {
      filter.$or = [
        { target: "all" },
        { students: student }
      ];
    }

    if (fromDate || toDate) {
      filter.datetime = {};
      if (fromDate) filter.datetime.$gte = new Date(fromDate);
      if (toDate) filter.datetime.$lte = new Date(toDate);
    }

    const classes = await VideoClass.find(filter).sort({ datetime: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: "수업방 조회 실패" });
  }
});

// 🔹 수업방 단건 조회
router.get("/:id", async (req, res) => {
  try {
    const found = await VideoClass.findById(req.params.id);
    if (!found) return res.status(404).json({ error: "수업방 없음" });
    res.json(found);
  } catch (err) {
    res.status(500).json({ error: "수업방 조회 실패" });
  }
});

// 🔹 수업방 수정
router.put("/:id", async (req, res) => {
  try {
    const updated = await VideoClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "수업방 수정 실패" });
  }
});

// 🔹 수업방 삭제
router.delete("/:id", async (req, res) => {
  try {
    await VideoClass.findByIdAndDelete(req.params.id);
    res.json({ message: "삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: "삭제 실패" });
  }
});

module.exports = router;
