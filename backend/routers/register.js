
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { id, pw, role, name, phone, email } = req.body;

  // 필수 항목 체크
  if (!id || !pw || !role || !name || !phone || !email) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  try {
    // 중복 아이디 체크
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
    }

    // 사용자 생성 및 저장
    const newUser = new User({ id, pw, role, name, phone, email });
    await newUser.save();

    res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

module.exports = router;
