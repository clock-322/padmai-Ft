// Attendance schema definition (for reference and validation)
const attendanceSchema = {
  studentId: {
    type: String,
    required: true,
  },
  teacherId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  }
};

// Attendance model functions
const Attendance = {
  collection: 'attendances',
  
  // Find attendances by query
  async find(query = {}) {
    const client = await require('../config/database')();
    const db = client.db();
    return await db.collection(Attendance.collection).find(query).toArray();
  },
  
  // Find attendance by student ID and date
  async findByStudentAndDate(studentId, date) {
    const client = await require('../config/database')();
    const db = client.db();
    const checkDate = new Date(date);
    const startOfDay = new Date(checkDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(checkDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await db.collection(Attendance.collection).findOne({
      studentId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });
  },
  
  // Get attendance history for a student (last 10 days)
  async getStudentHistory(studentId, limit = 10) {
    const client = await require('../config/database')();
    const db = client.db();
    
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - limit);
    
    return await db.collection(Attendance.collection)
      .find({
        studentId,
        date: { $gte: tenDaysAgo }
      })
      .sort({ date: -1 })
      .toArray();
  },
  
  // Create or update attendance
  async createOrUpdate(attendanceData) {
    const client = await require('../config/database')();
    const db = client.db();
    
    try {
      // Normalize date to start of day
      const date = new Date(attendanceData.date);
      date.setHours(0, 0, 0, 0);
      
      // Ensure studentId is always a string
      const normalizedStudentId = typeof attendanceData.studentId === 'string' 
        ? attendanceData.studentId.trim() 
        : String(attendanceData.studentId).trim();
      
      console.log('💾 Saving attendance - studentId:', normalizedStudentId, 'date:', date.toISOString());
      console.log('💾 Attendance data:', {
        studentId: normalizedStudentId,
        teacherId: attendanceData.teacherId,
        status: attendanceData.status,
        class: attendanceData.class,
        section: attendanceData.section,
        date: date
      });
      
      // Check if attendance already exists for this student and date
      const existing = await this.findByStudentAndDate(normalizedStudentId, date);
      console.log('💾 Existing attendance check:', existing ? 'Found existing' : 'No existing record');
      
      const attendance = {
        studentId: normalizedStudentId,
        teacherId: attendanceData.teacherId,
        status: attendanceData.status,
        class: attendanceData.class,
        section: attendanceData.section,
        date: date,
        updatedAt: new Date()
      };
      
      if (existing) {
        console.log('💾 Updating existing attendance record');
        // Update existing attendance
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        const result = await db.collection(Attendance.collection).findOneAndUpdate(
          { 
            studentId: normalizedStudentId,
            date: { $gte: startOfDay, $lte: endOfDay }
          },
          { $set: attendance },
          { returnDocument: 'after' }
        );
        
        if (!result) {
          console.error('❌ Failed to update attendance');
          throw new Error('Failed to update attendance');
        }
        
        console.log('💾 Updated attendance - studentId:', result.studentId, 'status:', result.status);
        return result;
      } else {
        console.log('💾 Creating new attendance record');
        // Create new attendance
        attendance.createdAt = new Date();
        
        const result = await db.collection(Attendance.collection).insertOne(attendance);
        console.log('💾 Insert result:', result.insertedId);
        
        if (!result.insertedId) {
          console.error('❌ Failed to insert attendance');
          throw new Error('Failed to insert attendance');
        }
        
        const savedAttendance = await db.collection(Attendance.collection).findOne({ _id: result.insertedId });
        
        if (!savedAttendance) {
          console.error('❌ Failed to retrieve saved attendance');
          throw new Error('Failed to retrieve saved attendance');
        }
        
        console.log('💾 Created attendance - studentId:', savedAttendance.studentId, 'status:', savedAttendance.status);
        return savedAttendance;
      }
    } catch (error) {
      console.error('❌ Error in createOrUpdate:', error);
      throw error;
    }
  },
  
  // Delete old attendance records (older than 10 days)
  async deleteOldRecords() {
    const client = await require('../config/database')();
    const db = client.db();
    
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    tenDaysAgo.setHours(0, 0, 0, 0);
    
    const result = await db.collection(Attendance.collection).deleteMany({
      date: { $lt: tenDaysAgo }
    });
    
    return result.deletedCount;
  },
  
  // Get attendance for multiple students on a specific date
  async getAttendanceByDate(className, section, date) {
    const client = await require('../config/database')();
    const db = client.db();
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await db.collection(Attendance.collection)
      .find({
        class: className,
        section,
        date: { $gte: startOfDay, $lte: endOfDay }
      })
      .toArray();
  },
  
  // Get all attendance records for a class (latest attendance for each student)
  async getLatestAttendanceByClass(className, section) {
    const client = await require('../config/database')();
    const db = client.db();
    
    console.log(`🔍 Querying attendance for class: ${className}, section: ${section}`);
    
    // Get all attendance records for the class, sorted by date descending
    const allAttendances = await db.collection(Attendance.collection)
      .find({
        class: className,
        section
      })
      .sort({ date: -1 })
      .toArray();
    
    console.log(`🔍 Found ${allAttendances.length} total attendance records`);
    
    // Group by studentId and get the latest attendance for each student
    const latestAttendanceMap = {};
    allAttendances.forEach(att => {
      // Normalize studentId to ensure consistent matching
      const studentId = typeof att.studentId === 'string' 
        ? att.studentId 
        : (att.studentId?.toString ? att.studentId.toString() : String(att.studentId));
      
      if (!latestAttendanceMap[studentId] || new Date(att.date) > new Date(latestAttendanceMap[studentId].date)) {
        latestAttendanceMap[studentId] = att;
      }
    });
    
    console.log(`🔍 Latest attendance for ${Object.keys(latestAttendanceMap).length} unique students`);
    
    return Object.values(latestAttendanceMap);
  },
  
  schema: attendanceSchema
};

module.exports = Attendance;

