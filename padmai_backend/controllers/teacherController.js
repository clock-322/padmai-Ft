const TeacherAssignment = require('../models/TeacherAssignment');
const Student = require('../models/Student');

// Get Class Students
exports.getClassStudents = async (req, res) => {
  try {
    const { teacherId } = req.body;
    console.log('👨‍🏫 Get Class Students API called for teacher:', teacherId);

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Teacher ID is required'
      });
    }

    // Check if teacher has class assigned
    const assignment = await TeacherAssignment.findByTeacherId(teacherId);
    
    if (!assignment) {
      console.log('❌ No class assigned to teacher:', teacherId);
      return res.status(400).json({
        success: false,
        message: 'No class assigned yet'
      });
    }

    // Find all students in the assigned class and section
    const students = await Student.find({ 
      class: assignment.class, 
      section: assignment.section 
    });

    console.log('✅ Students retrieved for teacher:', teacherId, 'Count:', students.length);
    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: {
        class: assignment.class,
        section: assignment.section,
        students,
        count: students.length
      }
    });
  } catch (error) {
    console.error('❌ Get class students error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

