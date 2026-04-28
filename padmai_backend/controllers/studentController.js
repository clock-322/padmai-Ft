const Student = require('../models/Student');

// Add Student
exports.addStudent = async (req, res) => {
  try {
    const { parentId, firstName, lastName, class: className, section, registrationNo, classRollNo, gender, idNumber } = req.body;
    console.log('👨‍🎓 Add Student API called by parent:', parentId);

    // Check if registration number already exists
    const existingStudent = await Student.find({ registrationNo });
    if (existingStudent.length > 0) {
      console.log('❌ Student with registration number already exists:', registrationNo);
      return res.status(400).json({
        success: false,
        message: 'Student with this registration number already exists'
      });
    }

    const student = await Student.create({
      parentId,
      firstName,
      lastName,
      class: className,
      section,
      registrationNo,
      classRollNo,
      ...(gender && { gender }),
      ...(idNumber && { idNumber }),
    });

    console.log('✅ Student added successfully:', student._id);
    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: {
        student
      }
    });
  } catch (error) {
    console.error('❌ Add student error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error adding student',
      error: error.message
    });
  }
};

// Get Parent Students
exports.getParentStudent = async (req, res) => {
  try {
    const { parentId } = req.body;
    console.log('👨‍🎓 Get Parent Students API called for parent:', parentId);

    if (!parentId) {
      return res.status(400).json({
        success: false,
        message: 'Parent ID is required'
      });
    }

    const students = await Student.find({ parentId });

    console.log('✅ Students retrieved for parent:', parentId, 'Count:', students.length);
    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: {
        students,
        count: students.length
      }
    });
  } catch (error) {
    console.error('❌ Get parent students error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    console.log('👨‍🎓 Get All Students API called');

    const students = await Student.find({});

    console.log('✅ All students retrieved. Count:', students.length);
    res.status(200).json({
      success: true,
      message: 'All students retrieved successfully',
      data: {
        students,
        count: students.length
      }
    });
  } catch (error) {
    console.error('❌ Get all students error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching all students',
      error: error.message
    });
  }
};

