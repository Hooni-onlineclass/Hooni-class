
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  text: String,           // 질문 내용
  author: String,         // 작성자 이름
  date: { type: Date, default: Date.now }, // 작성일
  reply: String,          // 관리자 답변
  status: { type: String, default: '대기중' } // 상태: 대기중 / 완료
});

module.exports = mongoose.model('Inquiry', inquirySchema);
