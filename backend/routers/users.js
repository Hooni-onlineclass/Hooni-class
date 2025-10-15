
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ 사용자 목록 조회
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { _id: 0, id: 1, role: 1, name: 1, email: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "사용자 목록 조회 실패", error: err.message });
  }
});

// ✅ 사용자 회원가입 (ID 중복 체크 포함)
router.post("/", async (req, res) => {
  const { id, name, email, role } = req.body;

  console.log("회원가입 요청 받은 ID:", id); // ✅ 로그 추가

  try {
    const existing = await User.findOne({ id });
    if (existing) {
      console.log("회원가입 실패: 중복된 ID"); // ✅ 중복 로그
      return res.status(409).json({ message: "이미 존재하는 ID입니다." });
    }

    const newUser = new User({ id, name, email, role });
    await newUser.save();

    res.status(201).json({ message: "회원가입 완료", user: newUser });
  } catch (err) {
    console.log("회원가입 중 에러:", err.message); // ✅ 에러 로그
    res.status(500).json({ message: "회원가입 실패", error: err.message });
  }
});

// ✅ 사용자 정보 수정
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  console.log("수정 요청 받은 ID:", id);
  console.log("수정할 데이터:", { name, email, role });

  try {
    const updatedUser = await User.findOneAndUpdate(
      { id },
      { name, email, role },
      { new: true }
    );

    if (!updatedUser) {
      console.log("수정 실패: 해당 ID 없음");
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({ message: "수정 완료", user: updatedUser });
  } catch (err) {
    console.log("수정 중 에러:", err.message);
    res.status(500).json({ message: "사용자 정보 수정 실패", error: err.message });
  }
});

// ✅ 사용자 삭제
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  console.log("삭제 요청 받은 ID:", id);

  try {
    const deletedUser = await User.findOneAndDelete({ id });

    if (!deletedUser) {
      console.log("삭제 실패: 해당 ID 없음");
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({ message: "삭제 완료", user: deletedUser });
  } catch (err) {
    console.log("삭제 중 에러:", err.message);
    res.status(500).json({ message: "사용자 삭제 실패", error: err.message });
  }
});

module.exports = router;
