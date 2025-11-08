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
    
    // Normalize studentId to string for consistent matching
    const normalizedStudentId = student._id.toString();
    
    console.log('📝 Setting attendance - Original studentId:', studentId, 'Normalized:', normalizedStudentId);
    console.log('📝 Assignment details:', {
      class: assignment.class,
      section: assignment.section,
      teacherId: teacherId
    });
    
    // Update attendance status in student document
    let updatedStudent;
    try {
      updatedStudent = await Student.updateAttendanceStatus(
        normalizedStudentId,
        status,
        attendanceDate
      );
    } catch (dbError) {
      console.error('❌ Database error in updateAttendanceStatus:', dbError);
      throw dbError;
    }

    if (!updatedStudent) {
      console.error('❌ Student is null after updateAttendanceStatus');
      return res.status(500).json({
        success: false,
        message: 'Failed to update attendance - no data returned'
      });
    }

    console.log('📝 Attendance saved successfully:', {
      studentId: updatedStudent._id.toString(),
      status: updatedStudent.attendanceStatus,
      historyCount: updatedStudent.attendanceHistory?.length || 0
    });

    console.log('✅ Attendance set successfully for student:', normalizedStudentId);
    res.status(200).json({
      success: true,
      message: 'Attendance set successfully',
      data: {
        student: {
          id: updatedStudent._id,
          firstName: updatedStudent.firstName,
          lastName: updatedStudent.lastName,
          attendanceStatus: updatedStudent.attendanceStatus
        }
      }
    });
  } catch (error) {
    console.error('❌ Set attendance error:', error);
    console.error('❌ Error stack:', error.stack);
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

    // Get attendance history for past 30 days from student document
    const history = await Student.getAttendanceHistory(studentId);
    const formattedHistory = history.map(entry => ({
      date: entry.date instanceof Date ? entry.date.toISOString() : new Date(entry.date).toISOString(),
      status: entry.status,
      updatedAt: entry.updatedAt ? (entry.updatedAt instanceof Date ? entry.updatedAt.toISOString() : new Date(entry.updatedAt).toISOString()) : null
    }));

    console.log('✅ Attendance history retrieved for student:', studentId, 'Count:', formattedHistory.length);
    res.status(200).json({
      success: true,
      message: 'Attendance history retrieved successfully',
      data: {
        student: {
          id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          class: student.class,
          section: student.section,
          attendanceStatus: student.attendanceStatus
        },
        history: formattedHistory,
        count: formattedHistory.length
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

// Get Attendance for Class (latest attendance for each student, no date limitation)
exports.getClassAttendance = async (req, res) => {
  try {
    const { teacherId } = req.body;
    console.log('📅 Get Class Attendance API called for teacher:', teacherId);

    // Verify teacher has class assigned
    const assignment = await TeacherAssignment.findByTeacherId(teacherId);
    if (!assignment) {
      return res.status(400).json({
        success: false,
        message: 'No class assigned yet'
      });
    }

    // Get all students in the class
    const students = await Student.find({
      class: assignment.class,
      section: assignment.section
    });

    console.log(`📊 Found ${students.length} students for class ${assignment.class}, section ${assignment.section}`);

    // Combine student data with attendance status and calculate statistics
    let presentCount = 0;
    let absentCount = 0;
    
    const studentsWithAttendance = students.map(student => {
      // Get attendance status directly from student document
      const status = student.attendanceStatus || 'not_marked';
      
      // Count present/absent
      if (status === 'present') {
        presentCount++;
      } else if (status === 'absent') {
        absentCount++;
      }
      
      // Return simplified student object with attendance status
      return {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        classRollNo: student.classRollNo,
        registrationNo: student.registrationNo,
        attendanceStatus: status // Status directly from student document
      };
    });

    console.log('✅ Class attendance retrieved for teacher:', teacherId);
    res.status(200).json({
      success: true,
      message: 'Class attendance retrieved successfully',
      data: {
        class: assignment.class,
        section: assignment.section,
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

