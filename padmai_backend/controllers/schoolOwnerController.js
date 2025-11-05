const User = require('../models/User');
const TeacherAssignment = require('../models/TeacherAssignment');

// Get Teachers
exports.getTeachers = async (req, res) => {
  try {
    console.log('👨‍🏫 Get Teachers API called');

    // Find all users with role 'teacher'
    const teachers = await User.find({ role: 'teacher' });

    // Get all teacher assignments
    const assignments = await TeacherAssignment.find({});
    
    // Create a map of teacherId to assignment for quick lookup
    const assignmentMap = {};
    assignments.forEach(assignment => {
      assignmentMap[assignment.teacherId] = assignment;
    });

    // Remove password and add class/section assignment to each teacher
    const teachersWithAssignments = teachers.map((teacher) => {
      const { password, ...teacherWithoutPassword } = teacher;
      const teacherId = teacher._id.toString();
      
      // Find assignment for this teacher
      const assignment = assignmentMap[teacherId];
      
      // Add class and section to teacher object (null if no assignment)
      return {
        ...teacherWithoutPassword,
        class: assignment ? assignment.class : null,
        section: assignment ? assignment.section : null
      };
    });

    console.log('✅ Teachers retrieved. Count:', teachersWithAssignments.length);
    res.status(200).json({
      success: true,
      message: 'Teachers retrieved successfully',
      data: {
        teachers: teachersWithAssignments,
        count: teachersWithAssignments.length
      }
    });
  } catch (error) {
    console.error('❌ Get teachers error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: error.message
    });
  }
};

// Assign Teacher to Class
exports.assignTeacher = async (req, res) => {
  try {
    const { teacherId, class: className, section } = req.body;
    console.log('👨‍🏫 Assign Teacher API called for teacher:', teacherId);

    // Verify teacher exists
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      console.log('❌ Teacher not found:', teacherId);
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Verify teacher has teacher role
    if (teacher.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'User is not a teacher'
      });
    }

    // Create or update assignment
    const assignment = await TeacherAssignment.createOrUpdate({
      teacherId,
      class: className,
      section
    });

    console.log('✅ Teacher assigned successfully:', teacherId);
    res.status(200).json({
      success: true,
      message: 'Teacher assigned to class successfully',
      data: {
        assignment
      }
    });
  } catch (error) {
    console.error('❌ Assign teacher error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error assigning teacher',
      error: error.message
    });
  }
};

