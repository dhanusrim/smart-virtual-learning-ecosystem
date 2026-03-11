const express = require("express");
const router = express.Router();
const { updateProgress, getProgress } = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("student"), updateProgress);
router.get("/:courseId", authMiddleware, roleMiddleware("student"), getProgress);

module.exports = router;