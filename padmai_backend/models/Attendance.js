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
    
    const date = new Date(attendanceData.date);
    date.setHours(0, 0, 0, 0);
    
    const attendance = {
      ...attendanceData,
      date,
      updatedAt: new Date()
    };
    
    // Check if attendance already exists for this student and date
    const existing = await this.findByStudentAndDate(attendanceData.studentId, date);
    
    if (existing) {
      // Update existing attendance
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const result = await db.collection(Attendance.collection).findOneAndUpdate(
        { 
          studentId: attendanceData.studentId,
          date: { $gte: startOfDay, $lte: endOfDay }
        },
        { $set: attendance },
        { returnDocument: 'after' }
      );
      return result;
    } else {
      // Create new attendance
      attendance.createdAt = new Date();
      const result = await db.collection(Attendance.collection).insertOne(attendance);
      return await db.collection(Attendance.collection).findOne({ _id: result.insertedId });
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
  
  schema: attendanceSchema
};

module.exports = Attendance;

