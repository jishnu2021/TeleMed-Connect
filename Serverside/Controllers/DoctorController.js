const User = require('../Models/DoctoreSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const mongoose = require('mongoose');

// Doctor Registration
exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialist } = req.body;
    
    console.log('Registering new doctor:', { name, email, specialist });

    // Check if doctor already exists
    const existingDoctor = await User.findOne({ email, role: 1 });
    if (existingDoctor) {
      console.log('Doctor already exists with this email');
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      specialist, 
      role: 1 // 👈 role = 1 for doctor
    });

    await newDoctor.save();
    console.log('Doctor registered successfully with ID:', newDoctor._id);

    res.status(201).json({ 
      message: "Doctor registered successfully", 
      doctor: {
        _id: newDoctor._id,
        name: newDoctor.name,
        email: newDoctor.email,
        specialist: newDoctor.specialist
      } 
    });
  } catch (error) {
    console.error('Doctor registration failed:', error.message);
    res.status(500).json({ message: "Doctor registration failed", error: error.message });
  }
};

// Doctor Login
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await User.findOne({ email, role: 1 }); // 👈 role = 1
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const validPass = await bcrypt.compare(password, doctor.password);
    if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: doctor._id, role: doctor.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Doctor login successful", token, doctor });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Get all doctors - improved implementation
exports.getAllDoctors = async (req, res) => {
  try {
    // Ensure database connection
    await ensureDbConnection();
    
    console.log('Fetching all doctors');
    
    // Try with role filter first
    let doctors = await User.find({ role: 1 }).select('name specialist _id');
    
    // If no doctors found with role filter, try without filter
    if (doctors.length === 0) {
      console.log('No doctors found with role filter, trying without filter');
      doctors = await User.find({}).select('name specialist _id');
    }
    
    console.log(`Found ${doctors.length} doctors`);
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: "Error fetching doctors", error: error.message });
  }
};

// Get all specialists - improved implementation
// Fixed getAllSpecialists controller function
exports.getAllSpecialists = async (req, res) => {
  try {
    console.log('Fetching all specialists');
    
    // Get the User model directly to avoid any reference issues
    const User = require('../Models/DoctoreSchema');
    
    // Query without filter first to check if collection has data
    const allUsers = await User.find({});
    console.log(`Total users in database: ${allUsers.length}`);
    
    // Try with role filter
    let specialists = await User.find({ role: 1 }).select('name specialist _id');
    console.log(`Found ${specialists.length} specialists with role=1`);
    
    // If no specialists found with role filter, try with string '1' as some data might be stored as strings
    if (specialists.length === 0) {
      specialists = await User.find({ role: '1' }).select('name specialist _id');
      console.log(`Found ${specialists.length} specialists with role='1'`);
    }
    
    // If still no specialists found, return all users with specialist field
    if (specialists.length === 0) {
      console.log('No specialists found with role filter, returning users with specialist field');
      specialists = await User.find({ specialist: { $exists: true, $ne: '' } }).select('name specialist _id');
      console.log(`Found ${specialists.length} specialists with specialist field`);
    }
    
    // If all else fails, return all users
    if (specialists.length === 0) {
      console.log('No specialists found with any filter, returning all users');
      specialists = allUsers.map(user => ({
        _id: user._id,
        name: user.name,
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
// Get all doctors by specialty - improved implementation
exports.getAllDoctorsSpeciality = async (req, res) => {
  try {
    // Ensure database connection
    await ensureDbConnection();
    
    console.log('Fetching all doctors by specialty');
    
    // Try with role filter first
    let doctors = await User.find({ role: 1 }).select('name specialist _id');
    
    // If no doctors found with role filter, try without filter
    if (doctors.length === 0) {
      console.log('No doctors found with role filter, trying without filter');
      doctors = await User.find({}).select('name specialist _id');
    }
    
    console.log(`Found ${doctors.length} doctors`);
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors by specialty:', error);
    res.status(500).json({ message: "Error fetching doctors by specialty", error: error.message });
  }
};

// Update doctor profile
exports.updateDoctorProfile = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // If password fields are included, validate and update the password
    if (oldPassword && newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New password and confirm password do not match' });
      }

      // Find the doctor by ID
      const doctor = await User.findById(req.params.docId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      // Compare the provided old password with the stored hashed password
      const isMatch = await bcrypt.compare(oldPassword, doctor.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect old password' });
      }

      // Hash the new password before saving it
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password in the database
      await User.updateOne({ _id: req.params.docId }, { $set: { password: hashedPassword } });
      return res.status(200).json({ message: 'Password updated successfully' });
    }

    // If no password is included in the request, update other fields (like name, email, specialty)
    const updateData = req.body;
    
    // Exclude password fields from updateData to ensure it's only other fields being updated
    if (updateData.password) {
      delete updateData.password;
    }

    const result = await User.updateOne({ _id: req.params.docId }, { $set: updateData });

    if (result.nModified === 0 && result.matchedCount === 0) {
      return res.status(404).json({ message: 'Doctor not found or no changes made' });
    }

    res.status(200).json({ message: 'Doctor profile updated successfully', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Fetch doctor details
exports.getDoctorDetails = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.docId).select('-password'); // Exclude password field
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get registered doctors
exports.getRegisteredDoctors = async (req, res) => {
  try {
    // Ensure database connection
    await ensureDbConnection();
    
    console.log('Fetching registered doctors');
    
    // Try with role filter first
    let doctors = await User.find({ role: 1 }).select('name specialist _id');
    
    // If no doctors found with role filter, try without filter
    if (doctors.length === 0) {
      console.log('No doctors found with role filter, trying without filter');
      doctors = await User.find({}).select('name specialist _id');
    }
    
    console.log(`Found ${doctors.length} registered doctors`);
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching registered doctors:', error);
    res.status(500).json({ message: "Error fetching registered doctors", error: error.message });
  }
};

// Helper function to ensure database connection
async function ensureDbConnection() {
  if (mongoose.connection.readyState !== 1) {
    console.log('MongoDB connection not established. Connecting now...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connection established');
  }
}