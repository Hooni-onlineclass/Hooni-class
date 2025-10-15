
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.patch("/", async (req, res) => {
  const { id, phone, newPw } = req.body;

  if (!id || !phone || !newPw) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  try {
    const user = await User.findOne({ id, phone });

    if (!user) {
      return res.status(404).json({ message: "아이디 또는 휴대폰 번호가 일치하지 않습니다." });
    }

    user.pw = newPw;
    await user.save();

    res.json({ message: "비밀번호가 성공적으로 재설정되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

module.exports = router;
