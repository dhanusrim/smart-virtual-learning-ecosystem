const express = require("express");
const router = express.Router();
const {
  createAssessment,
  getAssessmentsByCourse,
  getAssessmentById,
  submitAssessment,
  deleteAssessment,
} = require("../controllers/assessmentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("admin", "faculty"), createAssessment);
router.get("/course/:courseId", authMiddleware, getAssessmentsByCourse);
router.get("/:id", authMiddleware, getAssessmentById);
router.post("/:id/submit", authMiddleware, roleMiddleware("student"), submitAssessment);
router.delete("/:id", authMiddleware, roleMiddleware("admin", "faculty"), deleteAssessment);


module.exports = router;