const express = require("express");
const router = express.Router();
const { createNotification, getNotifications } = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("faculty", "admin"), createNotification);
router.get("/", authMiddleware, getNotifications);

module.exports = router;