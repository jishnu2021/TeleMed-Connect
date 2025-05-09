const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: [true, 'Appointment ID is required'],
    index: true // Add index for better query performance
  },
  sender: {
    type: String,
    required: [true, 'Sender is required'],
    enum: ['patient', 'doctor'] // Limit sender types
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Compound index for faster queries by appointment and timestamp
messageSchema.index({ appointmentId: 1, timestamp: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;