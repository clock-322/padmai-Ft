// TeacherAssignment schema definition (for reference and validation)
const teacherAssignmentSchema = {
  teacherId: {
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
  }
};

// TeacherAssignment model functions
const TeacherAssignment = {
  collection: 'teacher_assignments',
  
  // Find assignments by query
  async find(query = {}) {
    const client = await require('../config/database')();
    const db = client.db();
    return await db.collection(TeacherAssignment.collection).find(query).toArray();
  },
  
  // Find assignment by teacher ID
  async findByTeacherId(teacherId) {
    const client = await require('../config/database')();
    const db = client.db();
    return await db.collection(TeacherAssignment.collection).findOne({ teacherId });
  },
  
  // Create or update assignment
  async createOrUpdate(assignmentData) {
    const client = await require('../config/database')();
    const db = client.db();
    
    const assignment = {
      ...assignmentData,
      updatedAt: new Date()
    };
    
    // Check if assignment already exists for this teacher
    const existing = await db.collection(TeacherAssignment.collection).findOne({ 
      teacherId: assignmentData.teacherId 
    });
    
    if (existing) {
      // Update existing assignment
      const result = await db.collection(TeacherAssignment.collection).findOneAndUpdate(
        { teacherId: assignmentData.teacherId },
        { $set: assignment },
        { returnDocument: 'after' }
      );
      return result;
    } else {
      // Create new assignment
      assignment.createdAt = new Date();
      const result = await db.collection(TeacherAssignment.collection).insertOne(assignment);
      return await db.collection(TeacherAssignment.collection).findOne({ _id: result.insertedId });
    }
  },
  
  schema: teacherAssignmentSchema
};

module.exports = TeacherAssignment;

