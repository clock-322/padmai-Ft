const { MongoClient } = require('mongodb');

let cached = global.mongoClient;
if (!cached) {
  cached = global.mongoClient = { client: null, promise: null };
}

const connectDB = async () => {
  // Return cached client if already connected
  if (cached.client) return cached.client;

  // Create new connection if not already connecting
  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 10000, // 10s to find server
      socketTimeoutMS: 45000,          // 45s idle timeout
      family: 4,                       // 👈 Force IPv4 (fixes your "connection <monitor>" error)
      retryWrites: true,
      w: 'majority',
    };

    cached.promise = MongoClient.connect(process.env.MONGODB_URI, opts)
      .then((client) => {
        console.log('✅ MongoDB Connected successfully');
        return client;
      })
      .catch((err) => {
        console.error('❌ MongoDB Connection Failed:', err.message);
        throw err;
      });
  }

  try {
    cached.client = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error(`MongoDB Connection Error: ${err.message}`);
    throw err;
  }

  return cached.client;
};

module.exports = connectDB;