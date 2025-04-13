const User = require('../Models/DoctoreSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET; // move to .env

// Doctor Registration
exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password ,specialist} = req.body;

    // Check if doctor already exists
    const existingDoctor = await User.findOne({ email, role: 1 });
    if (existingDoctor) return res.status(400).json({ message: "Doctor already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new User({ name, email, password: hashedPassword, specialist, role: 1 }); // 👈 role = 1 for doctor

    await newDoctor.save();

    res.status(201).json({ message: "Doctor registered successfully", doctor: newDoctor });
  } catch (error) {
    res.status(500).json({ message: "Doctor registration failed", error: error.message });
  }
};

// Doctor Login
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await User.findOne({ email, role: 1 }); // 👈 role = 1
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // const validPass = await bcrypt.compare(password, doctor.password);
    // if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: doctor._id, role: doctor.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Doctor login successful", token, doctor });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 1 }); // 👈 role = 1 for doctor
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Fetching doctors failed", error: error.message });
  }
}
exports.getAllSpecialists = async (req, res) => {
  try {
    const specialists = await User.find({ role: 1 }).distinct('specialist'); // Fetch specialists
    res.status(200).json(specialists);  // Return as JSON array
  } catch (error) {
    res.status(500).json({ message: "Fetching specialists failed", error: error.message });
  }
};

exports.getAllDoctorsSpeciality = async (req, res) => {
  try {
    // Find all doctors and select their name and specialty fields
    const doctors = await User.find({}, 'name specialist'); // Assuming the fields are 'name' and 'specialty'

    // Return the doctors as JSON
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Fetching doctors failed', error: error.message });
  }
};

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

    if (result.nModified === 0) {
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