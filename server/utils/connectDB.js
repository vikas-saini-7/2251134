const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "dev";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

const connectDB = async () => {
  try {
    const mongoUriWithDb = `${MONGO_URI}/${DB_NAME}`;
    const connection = await mongoose.connect(mongoUriWithDb);

    console.log(
      `Connected to MongoDB database: ${DB_NAME} in ${process.env.NODE_ENV} environment`
    );

    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
