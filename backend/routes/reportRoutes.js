const express = require("express");
const router = express.Router();
const { getStudentReports } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/:courseId", authMiddleware, roleMiddleware("faculty", "admin"), getStudentReports);

module.exports = router;