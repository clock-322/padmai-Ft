// Student schema definition (for reference and validation)
const studentSchema = {
  parentId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  registrationNo: {
    type: String,
    required: true,
  },
  classRollNo: {
    type: String,
    required: true,
  },
  attendanceStatus: {
    type: String,
    enum: ['present', 'absent', 'not_marked', null],
    default: null
  },
  attendanceHistory: {
    type: Array,
    default: []
  }
};

// Student model functions
const Student = {
  collection: 'students',
  
  // Find students by query
  async find(query = {}) {
    const client = await require('../config/database')();
    const db = client.db();
    return await db.collection(Student.collection).find(query).toArray();
  },
  
  // Find student by ID
  async findById(id) {
    const client = await require('../config/database')();
    const db = client.db();
    const { ObjectId } = require('mongodb');
    return await db.collection(Student.collection).findOne({ _id: new ObjectId(id) });
  },
  
  // Create new student
  async create(studentData) {
    const client = await require('../config/database')();
    const db = client.db();
    
    const student = {
      ...studentData,
      attendanceStatus: null, // Initialize attendance status
      attendanceHistory: [], // Initialize attendance history
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection(Student.collection).insertOne(student);
    return await db.collection(Student.collection).findOne({ _id: result.insertedId });
  },
  
  // Update attendance status and add to history
  async updateAttendanceStatus(studentId, status, date) {
    const client = await require('../config/database')();
    const db = client.db();
    const { ObjectId } = require('mongodb');
    
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    
    const student = await db.collection(Student.collection).findOne({ 
      _id: new ObjectId(studentId) 
    });
    
    if (!student) {
      throw new Error('Student not found');
    }
    
    // Get current history or initialize
    let attendanceHistory = student.attendanceHistory || [];
    
    // Add new attendance record to history
    const historyEntry = {
      date: attendanceDate,
      status: status,
      updatedAt: new Date()
    };
    
    // Check if attendance already exists for this date
    const existingIndex = attendanceHistory.findIndex(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === attendanceDate.getTime();
    });
    
    if (existingIndex >= 0) {
      // Update existing entry
      attendanceHistory[existingIndex] = historyEntry;
    } else {
      // Add new entry
      attendanceHistory.push(historyEntry);
    }
    
    // Sort by date descending (newest first)
    attendanceHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Keep only last 30 days
    const maxDays = 30;
    const cutoffDate = new Date();
    cutoffDate.setHours(0, 0, 0, 0);
    cutoffDate.setDate(cutoffDate.getDate() - (maxDays - 1));
    
    attendanceHistory = attendanceHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate >= cutoffDate;
    });
    
    // Ensure history does not exceed maxDays entries
    if (attendanceHistory.length > maxDays) {
      attendanceHistory = attendanceHistory.slice(0, maxDays);
    }
    
    // Update student document
    const result = await db.collection(Student.collection).findOneAndUpdate(
      { _id: new ObjectId(studentId) },
      {
        $set: {
          attendanceStatus: status,
          attendanceHistory: attendanceHistory,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    
    return result?.value || null;
  },
  
  // Get attendance history for a student (last 10 days)
  async getAttendanceHistory(studentId) {
    const client = await require('../config/database')();
    const db = client.db();
    const { ObjectId } = require('mongodb');
    
    const student = await db.collection(Student.collection).findOne({
      _id: new ObjectId(studentId)
    });
    
    if (!student) {
      return [];
    }
    
    // Get history and filter to last 10 days
    const attendanceHistory = student.attendanceHistory || [];
    const maxDays = 30;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create a map for quick lookup
    const historyMap = {};
    attendanceHistory.forEach(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      historyMap[entryDate.getTime()] = {
        status: entry.status,
        updatedAt: entry.updatedAt ? new Date(entry.updatedAt) : null
      };
    });
    
    const result = [];
    for (let i = 0; i < maxDays; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const timeKey = day.getTime();
      const historyEntry = historyMap[timeKey];
      
      result.push({
        date: day,
        status: historyEntry ? historyEntry.status : 'not_marked',
        updatedAt: historyEntry?.updatedAt || null
      });
    }
    
    return result;
  },
  
  schema: studentSchema
};

module.exports = Student;

