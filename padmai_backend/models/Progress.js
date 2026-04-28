// Progress model functions
const Progress = {
  collection: 'progress',

  // Find progress by query
  async find(query = {}) {
    const client = await require('../config/database')();
    const db = client.db();
    return await db.collection(Progress.collection).find(query).toArray();
  },

  // Find one progress record
  async findOne(query = {}) {
    const client = await require('../config/database')();
    const db = client.db();
    return await db.collection(Progress.collection).findOne(query);
  },

  // Create or update progress (upsert by studentId + month + year)
  async upsert(filter, data) {
    const client = await require('../config/database')();
    const db = client.db();
    const result = await db.collection(Progress.collection).findOneAndUpdate(
      filter,
      { $set: { ...data, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );
    return result;
  },
};

module.exports = Progress;
