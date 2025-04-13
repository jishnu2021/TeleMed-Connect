const Message = require('../Models/Message');

// Save the message
const sendMessage = async (req, res) => {
  const { appointmentId, sender, message } = req.body;

  try {
    const newMessage = new Message({
      appointmentId,
      sender,
      message,
    });

    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

// Get message history for a specific appointment
const getMessages = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const messages = await Message.find({ appointmentId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
