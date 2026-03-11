const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Enrollment = require("../models/Enrollment");

router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Only students can enroll" });

  const alreadyEnrolled = await Enrollment.findOne({ student: req.user._id, course: req.body.courseId });
  if (alreadyEnrolled) return res.status(400).json({ message: "Already enrolled" });

  const enrollment = await Enrollment.create({ student: req.user._id, course: req.body.courseId });
  res.status(201).json(enrollment);
});

router.get("/my", authMiddleware, async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id }).populate("course", "title description");
  res.json(enrollments);
});

module.exports = router;