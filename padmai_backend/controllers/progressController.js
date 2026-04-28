const Progress = require('../models/Progress');

// Save progress (teacher saves marks for a student)
exports.saveProgress = async (req, res) => {
  try {
    const { teacherId, studentId, month, year, subjects } = req.body;
    console.log('📊 Save Progress API called for student:', studentId, 'month:', month, 'year:', year);

    if (!studentId || month === undefined || year === undefined || !subjects) {
      return res.status(400).json({
        success: false,
        message: 'studentId, month, year, and subjects are required',
      });
    }

    const filter = { studentId, month, year };
    const data = { teacherId, studentId, month, year, subjects };
    const progress = await Progress.upsert(filter, data);

    console.log('✅ Progress saved for student:', studentId);
    res.status(200).json({
      success: true,
      message: 'Progress saved successfully',
      data: { progress },
    });
  } catch (error) {
    console.error('❌ Save progress error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error saving progress',
      error: error.message,
    });
  }
};

// Get progress by teacher (for teacher's view)
exports.getProgressByTeacher = async (req, res) => {
  try {
    const { teacherId, month, year } = req.query;
    console.log('📊 Get Progress by teacher:', teacherId, 'month:', month, 'year:', year);

    const query = {};
    if (teacherId) query.teacherId = teacherId;
    if (month !== undefined) query.month = parseInt(month);
    if (year !== undefined) query.year = parseInt(year);

    const progress = await Progress.find(query);

    res.status(200).json({
      success: true,
      message: 'Progress retrieved successfully',
      data: progress,
    });
  } catch (error) {
    console.error('❌ Get progress error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message,
    });
  }
};

// Get progress by student (for parent's view)
exports.getProgressByStudent = async (req, res) => {
  try {
    const { studentId } = req.query;
    console.log('📊 Get Progress by student:', studentId);

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'studentId is required',
      });
    }

    const progress = await Progress.find({ studentId });

    // Transform to the format expected by the parent app
    const data = progress.map(p => ({
      month: getMonthName(p.month),
      year: p.year,
      subjects: (p.subjects || [])
        .filter(s => s.marksObtained !== null)
        .map(s => ({
          name: s.subject,
          marks: s.marksObtained,
          total: s.totalMarks,
        })),
    }));

    res.status(200).json({
      success: true,
      message: 'Progress retrieved successfully',
      data,
    });
  } catch (error) {
    console.error('❌ Get progress by student error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message,
    });
  }
};

function getMonthName(month) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[month] || '';
}
