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
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection(Student.collection).insertOne(student);
    return await db.collection(Student.collection).findOne({ _id: result.insertedId });
  },
  
  schema: studentSchema
};

module.exports = Student;

