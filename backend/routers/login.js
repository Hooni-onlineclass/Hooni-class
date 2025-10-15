
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // MongoDB 모델

router.post("/", async (req, res) => {
  const { id, pw, role } = req.body;

  if (!id || !pw || !role) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  try {
    const user = await User.findOne({ id, pw, role });

    if (!user) {
      return res.status(401).json({ message: "아이디, 비밀번호 또는 역할이 틀렸습니다." });
    }

    res.json({
      message: "로그인 성공!",
      role: user.role,
      name: user.name || "" // name 필드가 있다면 포함
    });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

module.exports = router;
