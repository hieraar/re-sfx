const mongoose = require('mongoose');
require('dotenv').config();

const encodedPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const username = process.env.MONGO_USERNAME;
const host = process.env.MONGO_HOST;
const connectionString = `mongodb+srv://${username}:${encodedPassword}@${host}/?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(connectionString);

    console.log('Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

module.exports = connectDB;
