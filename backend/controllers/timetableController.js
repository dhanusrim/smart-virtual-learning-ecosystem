const Timetable = require("../models/Timetable");
const Course = require("../models/Course");

// @desc    Create a new timetable entry
// @route   POST /api/timetable
// @access  Private (Admin, Faculty)
exports.createTimetableEntry = async (req, res) => {
  try {
    const { courseId, dayOfWeek, startTime, endTime, room } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Ensure faculty creating this owns the course or is admin
    if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to manage scheduling for this course" });
    }

    const timetable = await Timetable.create({
      course: courseId,
      faculty: req.user._id,
      dayOfWeek,
      startTime,
      endTime,
      room,
    });

    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all timetable entries (filtered optionally by course)
// @route   GET /api/timetable
// @access  Private
exports.getTimetables = async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) {
      filter.course = req.query.courseId;
    }

    // If student, they should only see timetables for enrolled courses, but simplifying for now.
    // In a full RBAC system, we'd filter by enrollments here if role === student.

    const timetables = await Timetable.find(filter)
      .populate("course", "title")
      .populate("faculty", "name");
      
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a timetable entry
// @route   DELETE /api/timetable/:id
// @access  Private (Admin, Faculty)
exports.deleteTimetableEntry = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }

    // Ensure faculty owns it or admin
    if (timetable.faculty.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this timetable entry" });
    }

    await timetable.deleteOne();
    res.json({ message: "Timetable entry removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
