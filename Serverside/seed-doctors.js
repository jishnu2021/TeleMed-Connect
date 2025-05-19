const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define a MongoDB URL - replace with your actual MongoDB Atlas connection string
const MONGODB_URL = 'mongodb+srv://your_username:your_password@your_cluster.mongodb.net/telemeddatabase?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// Import the Doctor model
const DoctorModel = require('./Models/DoctoreSchema');

// Sample doctor data
const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    password: 'password123', // Will be hashed before saving
    specialist: 'Cardiologist',
    role: 1 // 1 for doctor
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@example.com',
    password: 'password123',
    specialist: 'Dermatologist',
    role: 1
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    password: 'password123',
    specialist: 'Pediatrician',
    role: 1
  },
  {
    name: 'Dr. David Williams',
    email: 'david.williams@example.com',
    password: 'password123',
    specialist: 'Neurologist',
    role: 1
  },
  {
    name: 'Dr. Lisa Patel',
    email: 'lisa.patel@example.com',
    password: 'password123',
    specialist: 'Ophthalmologist',
    role: 1
  }
];

// Hash passwords and save doctors to database
async function seedDoctors() {
  try {
    // First clear the existing doctors
    await DoctorModel.deleteMany({ role: 1 });
    console.log('Cleared existing doctors');

    // Hash passwords and create new doctor records
    for (const doctor of doctors) {
      const hashedPassword = await bcrypt.hash(doctor.password, 10);
      await DoctorModel.create({
        ...doctor,
        password: hashedPassword
      });
    }

    console.log('Successfully seeded doctor data');
    
    // Verify the doctors were added
    const count = await DoctorModel.countDocuments({ role: 1 });
    console.log(`There are now ${count} doctors in the database`);
    
    // List all doctors for verification
    const allDoctors = await DoctorModel.find({}).select('name specialist email');
    console.log('Doctors in database:');
    console.log(allDoctors);
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding doctor data:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDoctors(); 