const Notification = require("../models/Notification");
const User = require("../models/User");

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Faculty, Admin
const createNotification = async (req, res) => {
    try {
        const { message, type, recipientEmail } = req.body; // Can be specific user or 'all'

        let recipientId = null;
        if (recipientEmail && recipientEmail !== "all") {
            const user = await User.findOne({ email: recipientEmail });
            if (!user) {
                return res.status(404).json({ message: "Recipient not found" });
            }
            recipientId = user._id;
        }

        const notification = new Notification({
            message,
            type,
            recipient: recipientId, // If null, it's a broadcast
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get notifications for logged in user
// @route   GET /api/notifications
// @access  All
const getNotifications = async (req, res) => {
    try {
        // Find notifications specifically for this user OR broadcast notifications (recipient: null)
        const notifications = await Notification.find({
            $or: [{ recipient: req.user._id }, { recipient: null }],
        }).sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
};
