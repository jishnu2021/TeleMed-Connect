const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  specialist: {
    type: String,
    required: true,
  },
  role: {
    type: Number, // 0 = patient, 1 = doctor
    required: true,
  },
});

module.exports = mongoose.model('doctordatasets', UserSchema);
