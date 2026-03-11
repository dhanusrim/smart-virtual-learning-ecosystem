const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  questions: [{ questionText: String, options: [String], answer: String }],
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    answers: [String],
    score: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model("Assessment", assessmentSchema);