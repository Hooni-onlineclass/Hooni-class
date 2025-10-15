
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../data/attendance.json');

// ✅ POST 출석 체크
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: '이름이 필요합니다.' });
  }

  const now = new Date();
  const timestamp = now.toISOString().slice(0, 16); // 예: "2025-10-08T09:15"

  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    let attendance = {};
    if (!err && data) {
      attendance = JSON.parse(data);
    }

    if (!attendance[timestamp]) attendance[timestamp] = [];

    if (!attendance[timestamp].includes(name)) {
      attendance[timestamp].push(name);

      fs.writeFile(DATA_PATH, JSON.stringify(attendance, null, 2), err => {
        if (err) {
          return res.status(500).json({ message: '출석 저장 실패' });
        }
        res.json({ message: `${name}님 ${timestamp} 출석 완료!` });
      });
    } else {
      res.json({ message: `${name}님은 이미 ${timestamp}에 출석하셨습니다.` });
    }
  });
});

// ✅ GET 출석 현황 조회
router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    const attendance = JSON.parse(data);
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: '출석 데이터를 불러올 수 없습니다.' });
  }
});

// ✅ DELETE 출석 기록 삭제
router.delete('/', (req, res) => {
  const { name, date } = req.body;
  if (!name || !date) {
    return res.status(400).json({ message: '이름과 날짜가 필요합니다.' });
  }

  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err || !data) {
      return res.status(500).json({ message: '출석 데이터를 불러올 수 없습니다.' });
    }

    const attendance = JSON.parse(data);

    if (!attendance[date]) {
      return res.status(404).json({ message: '해당 날짜에 출석 기록이 없습니다.' });
    }

    const index = attendance[date].indexOf(name);
    if (index === -1) {
      return res.status(404).json({ message: '해당 이름의 출석 기록이 없습니다.' });
    }

    attendance[date].splice(index, 1); // 이름 제거

    if (attendance[date].length === 0) {
      delete attendance[date]; // 출석자 없으면 날짜도 삭제
    }

    fs.writeFile(DATA_PATH, JSON.stringify(attendance, null, 2), err => {
      if (err) {
        return res.status(500).json({ message: '출석 기록 삭제 실패' });
      }
      res.json({ message: `${name}님의 ${date} 출석 기록이 삭제되었습니다.` });
    });
  });
});


module.exports = router;
