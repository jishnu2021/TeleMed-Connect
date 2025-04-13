const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  sender: { type: String, enum: ['patient', 'doctor'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
