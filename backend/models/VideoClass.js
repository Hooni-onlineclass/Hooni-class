
const mongoose = require("mongoose");

const videoClassSchema = new mongoose.Schema({
  title: { type: String, required: true },           // 수업 제목
  link: { type: String, required: true, unique: true }, // 화상 수업 링크 (고유)
  datetime: { type: Date, required: true },          // 수업 시작 시간
  isPublic: { type: Boolean, default: true },        // 공개 여부
  target: { type: String, enum: ["all", "specific"], default: "all" }, // 대상 설정
  students: { type: [String], default: [] },         // 특정 학생 이름 배열
  createdBy: { type: String, required: true },       // 관리자 이름 또는 ID
  createdAt: { type: Date, default: Date.now },      // 생성일
  updatedAt: { type: Date, default: Date.now }       // 수정일
});

// 수정 시 updatedAt 자동 갱신
videoClassSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("VideoClass", videoClassSchema);
