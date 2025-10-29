import mongoose from "mongoose";

// Cache the connection to avoid reconnecting on every request
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    // If already connected, return cached connection
    if (cached.conn) {
      console.log("✅ Using cached MongoDB connection");
      return cached.conn;
    }

    // If connection is in progress, wait for it
    if (cached.promise) {
      console.log("⏳ MongoDB connection in progress...");
      cached.conn = await cached.promise;
      return cached.conn;
    }

    // Initiate new connection
    mongoose.set("strictQuery", true);
    mongoose.set("debug", true);

    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
    });

    cached.conn = await cached.promise;
    console.log(`✅ MongoDB Connected: ${cached.conn.connection.host}`);

    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    cached.promise = null;
    throw error;
  }
};

export default connectDB;
