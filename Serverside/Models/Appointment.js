const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patientdatasets',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patientdatasets',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending' // pending | approved | rejected
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
