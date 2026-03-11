const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Course = require("../models/Course");

router.post("/", authMiddleware, async (req, res) => {
  const course = await Course.create({
    title: req.body.title,
    description: req.body.description,
    createdBy: req.user._id
  });
  res.status(201).json(course);
});

router.get("/", authMiddleware, async (req, res) => {
  const courses = await Course.find().populate("createdBy", "name email");
  res.json(courses);
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Restrict updates to creator or admin
    if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    const updatedCourse = await course.save();

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Restrict deletion to creator or admin
    if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await course.deleteOne();
    res.json({ message: "Course removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;