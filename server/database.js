const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cuescreen';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

connectDB();

module.exports = mongoose.connection;
