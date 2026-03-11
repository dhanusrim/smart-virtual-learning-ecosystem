const Assessment = require("../models/Assessment");

// @desc    Create a new assessment
// @route   POST /api/assessments
// @access  Faculty
const createAssessment = async (req, res) => {
  try {
    const { title, description, course, questions } = req.body;

    const assessment = new Assessment({
      title,
      description,
      course,
      questions,
    });

    const createdAssessment = await assessment.save();
    res.status(201).json(createdAssessment);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all assessments for a course
// @route   GET /api/assessments/course/:courseId
// @access  Faculty, Student
const getAssessmentsByCourse = async (req, res) => {
  try {
    const assessments = await Assessment.find({ course: req.params.courseId });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get single assessment
// @route   GET /api/assessments/:id
// @access  Faculty, Student
const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (assessment) {
      res.json(assessment);
    } else {
      res.status(404).json({ message: "Assessment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Submit assessment
// @route   POST /api/assessments/:id/submit
// @access  Student
const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected options
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Calculate score
    let score = 0;
    assessment.questions.forEach((question, index) => {
      if (question.answer === answers[index]) {
        score++;
      }
    });

    // Check if student already submitted (optional logic, but good for data integrity)
    const existingSubmissionIndex = assessment.submissions.findIndex(
      (sub) => sub.student.toString() === req.user._id.toString()
    );

    const submission = {
      student: req.user._id,
      answers,
      score,
    };

    if (existingSubmissionIndex !== -1) {
      // Update existing submission
      assessment.submissions[existingSubmissionIndex] = submission;
    } else {
        // Add new submission
      assessment.submissions.push(submission);
    }

    await assessment.save();
    res.json({ message: "Assessment submitted", score, total: assessment.questions.length });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Admin, Faculty
const deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    await assessment.deleteOne();
    res.json({ message: "Assessment removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  createAssessment,
  getAssessmentsByCourse,
  getAssessmentById,
  submitAssessment,
  deleteAssessment,
};
