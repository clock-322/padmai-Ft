const Attendance = require('../models/Attendance');
const TeacherAssignment = require('../models/TeacherAssignment');
const Student = require('../models/Student');

// Set Attendance
exports.setAttendance = async (req, res) => {
  try {
    const { teacherId, studentId, date, status } = req.body;
    console.log('📅 Set Attendance API called for teacher:', teacherId, 'student:', studentId);

    // Verify teacher has class assigned
    const assignment = await TeacherAssignment.findByTeacherId(teacherId);
    if (!assignment) {
      return res.status(400).json({
        success: false,
        message: 'No class assigned yet'
      });
    }

    // Verify student exists and belongs to teacher's assigned class
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.class !== assignment.class || student.section !== assignment.section) {
      return res.status(403).json({
        success: false,
        message: 'Student does not belong to your assigned class'
      });
    }

    // Validate status
    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "present" or "absent"'
      });
    }

    // Use provided date or current date
    const attendanceDate = date ? new Date(date) : new Date();
    
    // Create or update attendance
    const attendance = await Attendance.createOrUpdate({
      studentId,
      teacherId,
      date: attendanceDate,
      status,
      class: assignment.class,
      section: assignment.section
    });

    // Auto-cleanup old records (older than 10 days)
    await Attendance.deleteOldRecords();

    console.log('✅ Attendance set successfully for student:', studentId);
    res.status(200).json({
      success: true,
      message: 'Attendance set successfully',
      data: {
        attendance
      }
    });
  } catch (error) {
    console.error('❌ Set attendance error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error setting attendance',
      error: error.message
    });
  }
};

// Get Attendance History (Past 10 days)
exports.getAttendanceHistory = async (req, res) => {
  try {
    const { studentId } = req.body;
    console.log('📅 Get Attendance History API called for student:', studentId);

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get attendance history for past 10 days
    const history = await Attendance.getStudentHistory(studentId, 10);

    // Auto-cleanup old records (older than 10 days)
    await Attendance.deleteOldRecords();

    console.log('✅ Attendance history retrieved for student:', studentId, 'Count:', history.length);
    res.status(200).json({
      success: true,
      message: 'Attendance history retrieved successfully',
      data: {
        student: {
          id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          class: student.class,
          section: student.section
        },
        history,
        count: history.length
      }
    });
  } catch (error) {
    console.error('❌ Get attendance history error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance history',
      error: error.message
    });
  }
};

// Get Attendance for Class (for a specific date)
exports.getClassAttendance = async (req, res) => {
  try {
    const { teacherId, date } = req.body;
    console.log('📅 Get Class Attendance API called for teacher:', teacherId);

    // Verify teacher has class assigned
    const assignment = await TeacherAssignment.findByTeacherId(teacherId);
    if (!assignment) {
      return res.status(400).json({
        success: false,
        message: 'No class assigned yet'
      });
    }

    // Use provided date or current date
    const attendanceDate = date ? new Date(date) : new Date();

    // Get all students in the class
    const students = await Student.find({
      class: assignment.class,
      section: assignment.section
    });

    // Get attendance for the date
    const attendances = await Attendance.getAttendanceByDate(
      assignment.class,
      assignment.section,
      attendanceDate
    );

    // Create a map of studentId to attendance
    const attendanceMap = {};
    attendances.forEach(att => {
      attendanceMap[att.studentId] = att;
    });

    // Combine student data with attendance and calculate statistics
    let presentCount = 0;
    let absentCount = 0;
    
    const studentsWithAttendance = students.map(student => {
      const attendance = attendanceMap[student._id.toString()] || null;
      const status = attendance ? attendance.status : null;
      
      // Count present/absent
      if (status === 'present') {
        presentCount++;
      } else if (status === 'absent') {
        absentCount++;
      }
      
      return {
        student: {
          id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          classRollNo: student.classRollNo,
          registrationNo: student.registrationNo
        },
        attendanceStatus: status, // Direct status field
        attendance: attendance ? {
          status: attendance.status,
          date: attendance.date
        } : null
      };
    });

    // Auto-cleanup old records (older than 10 days)
    await Attendance.deleteOldRecords();

    console.log('✅ Class attendance retrieved for teacher:', teacherId);
    res.status(200).json({
      success: true,
      message: 'Class attendance retrieved successfully',
      data: {
        class: assignment.class,
        section: assignment.section,
        date: attendanceDate,
        summary: {
          total: students.length,
          present: presentCount,
          absent: absentCount,
          notMarked: students.length - presentCount - absentCount
        },
        students: studentsWithAttendance,
        count: students.length
      }
    });
  } catch (error) {
    console.error('❌ Get class attendance error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching class attendance',
      error: error.message
    });
  }
};

