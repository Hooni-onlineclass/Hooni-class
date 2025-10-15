


require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // ✅ 추가
const Notice = require('./models/Notice');

const app = express();
app.use(express.json());
// ✅ CORS 설정 추가
app.use(cors({
  origin: 'https://hooni-class.netlify.app',
  credentials: true
}));
//✅ preflight 요청 처리 — 여기만 수정!
app.options('/*', cors());
// ✅ MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 🔐 라우터들 연결
app.use('/api/login', require('./routers/login'));
app.use('/api/attendance', require('./routers/attendance'));
app.use('/api/schedule', require('./routers/schedule'));
app.use('/api/video-class', require('./routers/videoClass'));
app.use('/api/inquiry', require('./routers/inquiry'));
app.use('/api/materials', require('./routers/materials'));
app.use('/api/quiz', require('./routers/quiz'));
app.use('/api/quiz-result', require('./routers/quiz-result'));
app.use('/api/register', require('./routers/register'));
app.use('/api/users', require('./routers/users')); // ✅ 사용자 라우터 연결됨
app.use('/api/reset-password', require('./routers/reset-password'));

// 📢 공지사항 API
app.post('/api/notices', async (req, res) => {
  try {
    const { text, author } = req.body;
    const notice = new Notice({ text, author });
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: '공지 등록 실패' });
  }
});

app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: '공지 조회 실패' });
  }
});

app.delete('/api/notices/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: '삭제 실패' });
  }
});

app.patch('/api/notices/:id', async (req, res) => {
  try {
    const { text } = req.body;
    const updated = await Notice.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '수정 실패' });
  }
});

app.patch('/api/notices/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    const updated = await Notice.findByIdAndUpdate(
      req.params.id,
      { reply },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '답변 실패' });
  }
});

// 🧾 정적 파일 제공은 반드시 마지막에!
app.use(express.static(path.join(__dirname, 'frontend')));

// 🚀 서버 실행
app.listen(4000, () => {
  console.log('🚀 서버가 4000번 포트에서 실행 중');
});
