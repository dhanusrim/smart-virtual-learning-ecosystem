const Assessment = require("../models/Assessment");
const Progress = require("../models/Progress");
const User = require("../models/User");

// @desc    Get student reports for a course
// @route   GET /api/reports/:courseId
// @access  Faculty, Admin
const getStudentReports = async (req, res) => {
    try {
        const { courseId } = req.params;

        // 1. Get all students (simplified: assuming we can filter users who are students, 
        //    or ideally, we'd query Enrollment model to find students enrolled in this course)
        //    For this implementation, let's assume we want to report on *all* students who have
        //    either progress or assessment submissions related to this course.

        // Better approach: fetch enrollments for course, then for each student, get data. 
        // BUT since Enrollment model wasn;t asked to be modified/viewed in detail, 
        // let's try to aggregate from Progress and Assessment submissions.

        // 1. Get all progress records for this course
        const progressRecords = await Progress.find({ course: courseId }).populate("student", "name email");

        // 2. Get all assessments for this course
        const assessments = await Assessment.find({ course: courseId });

        // 3. Aggregate data
        // We want a list of students with their progress and assessment scores.

        const reportData = progressRecords.map(record => {
            const studentId = record.student._id.toString();

            // Calculate average assessment score for this student in this course
            let totalScore = 0;
            let totalMaxScore = 0;

            assessments.forEach(assessment => {
                const submission = assessment.submissions.find(sub => sub.student.toString() === studentId);
                if (submission) {
                    totalScore += submission.score;
                }
                totalMaxScore += assessment.questions.length;
            });

            const assessmentPercentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

            return {
                studentName: record.student.name,
                studentEmail: record.student.email,
                progress: record.completionPercentage,
                status: record.status,
                assessmentScore: parseFloat(assessmentPercentage.toFixed(2)) // Keep it to 2 decimal places
            };
        });

        res.json(reportData);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    getStudentReports,
};
