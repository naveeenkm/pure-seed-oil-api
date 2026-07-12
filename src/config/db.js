const mongoose = require("mongoose");

const connectDB = async (uri) => {
  if (!uri) throw new Error("MONGODB_URI is not defined");

  if (mongoose.connection.readyState === 1) return;

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    bufferCommands: false,
  });
  console.log("Config:db - MongoDB connected");
};

module.exports = { connectDB };
