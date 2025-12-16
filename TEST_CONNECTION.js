// Test MongoDB Connection
const mongoose = require('mongoose');

// Replace YOUR_PASSWORD with actual password from Atlas
const MONGODB_URI = 'mongodb+srv://gopaparthiv_db_user:Gparthiv@cluster0.vaxcizd.mongodb.net/test?retryWrites=true&w=majority';

console.log('Testing MongoDB connection...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  });