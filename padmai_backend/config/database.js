const mongoose = require('mongoose');

// Cache the connection to reuse in serverless environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If connection exists and is ready, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If connection promise exists, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB Connected');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`MongoDB Connection Error: ${e.message}`);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;

