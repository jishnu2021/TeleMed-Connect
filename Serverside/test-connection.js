const mongoose = require('mongoose');
require('dotenv').config();

// Define the MongoDB URL
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/telemeddatabase';

console.log('Attempting to connect to MongoDB at:', MONGODB_URL);

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB');
    
    // Get the Doctor model
    const DoctorModel = require('./Models/DoctoreSchema');
    
    // Check if the collection exists and contains data
    try {
      const count = await DoctorModel.countDocuments();
      console.log(`Found ${count} documents in the doctordatasets collection`);
      
      if (count > 0) {
        // Get a sample of the doctors
        const doctors = await DoctorModel.find().limit(3);
        console.log('Sample doctors:');
        console.log(JSON.stringify(doctors, null, 2));
      } else {
        console.log('No doctors found in the collection');
      }
    } catch (err) {
      console.error('Error querying the database:', err.message);
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.error('Full error:', err);
  }); 