const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  completionPercentage: Number,
  status: { type: String, enum: ["Not Started", "In Progress", "Completed"] }
}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);