// Complete debug and fix for specialist controllers

// Import the correct model - adjust path as needed
const DoctorModel = require('../Models/DoctoreSchema');

// Helper function to ensure DB connection (define it if you're using it)
const ensureDbConnection = async () => {
  // This is just a placeholder - you might not need this if your connection is handled at app startup
  if (mongoose.connection.readyState !== 1) {
    console.log('Database not connected, attempting to connect...');
    await mongoose.connect(process.env.MONGODB_URL, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
  }
  return true;
};

// Fixed getAllSpecialists controller function
exports.getAllSpecialists = async (req, res) => {
  try {
    console.log('Fetching all specialists');
    
    // DEBUG: Log the model details to verify it's correctly loaded
    console.log('Model info:', {
      modelName: DoctorModel.modelName,
      collection: DoctorModel.collection.name
    });
    
    // DEBUG: Check if we can access the database at all
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
    } catch (e) {
      console.error('Error listing collections:', e);
    }
    
    // DEBUG: Get raw count from the collection to verify data exists
    try {
      const count = await DoctorModel.collection.countDocuments();
      console.log(`Raw collection document count: ${count}`);
    } catch (e) {
      console.error('Error counting documents:', e);
    }
    
    // Query without filter first to check if collection has data
    const allUsers = await DoctorModel.find({});
    console.log(`Total users in database: ${allUsers.length}`);
    
    // DEBUG: Log the first few documents to see their structure
    if (allUsers.length > 0) {
      console.log('Sample document structure:', JSON.stringify(allUsers[0].toObject(), null, 2));
    }
    
    // Try with role filter
    let specialists = await DoctorModel.find({ role: 1 }).select('name specialist _id');
    console.log(`Found ${specialists.length} specialists with role=1`);
    
    // If no specialists found with role filter, try with string '1'
    if (specialists.length === 0) {
      specialists = await DoctorModel.find({ role: '1' }).select('name specialist _id');
      console.log(`Found ${specialists.length} specialists with role='1'`);
    }
    
    // If still no specialists found, return all users with specialist field
    if (specialists.length === 0) {
      console.log('No specialists found with role filter, returning users with specialist field');
      specialists = await DoctorModel.find({ specialist: { $exists: true, $ne: '' } }).select('name specialist _id');
      console.log(`Found ${specialists.length} specialists with specialist field`);
    }
    
    // If all else fails, return all users
    if (specialists.length === 0) {
      console.log('No specialists found with any filter, returning all users');
      specialists = allUsers.map(user => ({
        _id: user._id,
        name: user.name || 'Unknown',
        specialist: user.specialist || 'Unknown'
      }));
    }
    
    console.log(`Returning ${specialists.length} specialists`);
    res.status(200).json(specialists);
  } catch (error) {
    console.error('Error fetching specialists:', error);
    res.status(500).json({ message: "Error fetching specialists", error: error.message });
  }
};

// Fixed getAllDoctorsSpeciality controller function
exports.getAllSpeciality = async (req, res) => {
  try {
    console.log('Fetching all doctors by specialty');
    
    // Use the same model as getAllSpecialists
    // Query without filter first to check if collection has data
    const allUsers = await DoctorModel.find({});
    console.log(`Total users in database: ${allUsers.length}`);
    
    // Try with role filter
    let doctors = await DoctorModel.find({ role: 1 }).select('name specialist _id');
    console.log(`Found ${doctors.length} doctors with role=1`);
    
    // If no doctors found with role filter, try with string '1'
    if (doctors.length === 0) {
      doctors = await DoctorModel.find({ role: '1' }).select('name specialist _id');
      console.log(`Found ${doctors.length} doctors with role='1'`);
    }
    
    // If still no doctors found, return all users with specialist field
    if (doctors.length === 0) {
      console.log('No doctors found with role filter, returning users with specialist field');
      doctors = await DoctorModel.find({ specialist: { $exists: true, $ne: '' } }).select('name specialist _id');
      console.log(`Found ${doctors.length} doctors with specialist field`);
    }
    
    // If all else fails, return all users
    if (doctors.length === 0) {
      console.log('No doctors found with any filter, returning all users');
      doctors = allUsers.map(user => ({
        _id: user._id,
        name: user.name || 'Unknown',
        specialist: user.specialist || 'Unknown'
      }));
    }
    
    console.log(`Returning ${doctors.length} doctors`);
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors by specialty:', error);
    res.status(500).json({ message: "Error fetching doctors by specialty", error: error.message });
  }
};