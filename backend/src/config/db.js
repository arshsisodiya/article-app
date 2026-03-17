/**
 * MongoDB connection helper.
 *
 * Uses a cached connection so that serverless environments (Vercel)
 * don't create a new connection on every invocation.
 */
const mongoose = require("mongoose");

let cached = global._mongooseConnection;

if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

/**
 * Connects to MongoDB using the MONGODB_URI environment variable.
 * Returns the cached connection if one already exists.
 *
 * @returns {Promise<typeof mongoose>} The Mongoose instance.
 */
async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    cached.promise = mongoose.connect(uri).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
