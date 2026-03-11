const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: String,
  type: { type: String, enum: ["info", "warning", "alert"] },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);