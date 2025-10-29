// Payment schema definition (for reference and validation)
const paymentSchema = {
  studentId: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
  }
};

// Payment model functions
const Payment = {
  collection: 'payments',
  
  // Find payments by query
  async find(query = {}) {
    const client = await require('../config/database')();
    const db = client.db();
    return await db.collection(Payment.collection).find(query).toArray();
  },
  
  // Find payments with sort
  async findWithSort(query = {}, sortOptions = { createdAt: -1 }) {
    const client = await require('../config/database')();
    const db = client.db();
    return await db.collection(Payment.collection).find(query).sort(sortOptions).toArray();
  },
  
  // Create new payment
  async create(paymentData) {
    const client = await require('../config/database')();
    const db = client.db();
    
    const payment = {
      ...paymentData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection(Payment.collection).insertOne(payment);
    return await db.collection(Payment.collection).findOne({ _id: result.insertedId });
  },
  
  schema: paymentSchema
};

module.exports = Payment;
