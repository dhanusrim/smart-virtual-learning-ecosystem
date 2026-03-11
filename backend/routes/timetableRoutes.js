const express = require("express");
const router = express.Router();
const {
  createTimetableEntry,
  getTimetables,
  deleteTimetableEntry,
} = require("../controllers/timetableController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("admin", "faculty"), createTimetableEntry);
router.get("/", authMiddleware, getTimetables);
router.delete("/:id", authMiddleware, roleMiddleware("admin", "faculty"), deleteTimetableEntry);

module.exports = router;
