const Progress = require("../models/Progress");

// @desc    Update progress for a course
// @route   POST /api/progress
// @access  Student
const updateProgress = async (req, res) => {
    try {
        const { courseId, completionPercentage, status } = req.body;

        let progress = await Progress.findOne({
            student: req.user._id,
            course: courseId,
        });

        if (progress) {
            progress.completionPercentage = completionPercentage;
            progress.status = status;
            await progress.save();
        } else {
            progress = new Progress({
                student: req.user._id,
                course: courseId,
                completionPercentage,
                status,
            });
            await progress.save();
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get progress for a course
// @route   GET /api/progress/:courseId
// @access  Student
const getProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({
            student: req.user._id,
            course: req.params.courseId,
        });

        if (progress) {
            res.json(progress);
        } else {
            // Return default progress if not started
            res.json({
                student: req.user._id,
                course: req.params.courseId,
                completionPercentage: 0,
                status: "Not Started",
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    updateProgress,
    getProgress,
};
