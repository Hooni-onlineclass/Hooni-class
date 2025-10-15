
const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule"); // MongoDB 모델 연결

// 일정 조회 (사용자별 필터)
router.get("/", async (req, res) => {
  const user = req.query.user;
  try {
    const query = user ? { user } : {};
    const schedules = await Schedule.find(query);
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: "일정 조회 실패" });
  }
});

// 일정 등록
router.post("/", async (req, res) => {
  try {
    const newSchedule = new Schedule({
      title: req.body.title,
      start: req.body.start,
      url: req.body.url,
      user: req.body.user
    });
    const saved = await newSchedule.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "일정 등록 실패" });
  }
});

// 일정 수정
router.put("/:id", async (req, res) => {
  try {
    const updated = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "일정 수정 실패" });
  }
});

// 일정 삭제
router.delete("/:id", async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: "일정 삭제 실패" });
  }
});

// 제목으로 일정 삭제
router.delete("/", async (req, res) => {
  const title = req.query.title;
  try {
    await Schedule.deleteMany({ title });
    res.json({ message: "제목 기준 일정 삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: "제목 기준 삭제 실패" });
  }
});


module.exports = router;
