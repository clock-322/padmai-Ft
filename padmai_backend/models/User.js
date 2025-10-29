const bcrypt = require('bcryptjs');

// User schema definition (for reference and validation)
const userSchema = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  }
};

// Hash password before saving
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Method to compare password
const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

// User model functions
const User = {
  collection: 'users',
  
  // Find user by email
  async findOne(query) {
    const client = await require('../config/database')();
    const db = client.db();
    return await db.collection(this.collection).findOne(query);
  },
  
  // Find user by ID
  async findById(id) {
    const client = await require('../config/database')();
    const db = client.db();
    const { ObjectId } = require('mongodb');
    return await db.collection(this.collection).findOne({ _id: new ObjectId(id) });
  },
  
  // Create new user
  async create(userData) {
    const client = await require('../config/database')();
    const db = client.db();
    
    // Hash password before saving
    const hashedPassword = await hashPassword(userData.password);
    const user = {
      ...userData,
      password: hashedPassword,
      role: userData.role || 'student',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection(this.collection).insertOne(user);
    return await db.collection(this.collection).findOne({ _id: result.insertedId });
  },
  
  // Compare password
  comparePassword,
  
  schema: userSchema
};

module.exports = User;
