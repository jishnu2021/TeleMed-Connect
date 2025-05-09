const Message = require('../Models/Message');
const mongoose = require('mongoose');

/**
 * Send a new message
 * @route POST /send-message
 */
const sendMessage = async (req, res) => {
  const { appointmentId, sender, message } = req.body;

  // Input validation
  if (!appointmentId || !sender || !message) {
    return res.status(400).json({ 
      success: false,
      error: 'Required fields missing: appointmentId, sender, and message are all required' 
    });
  }

  // Validate sender type
  if (sender !== 'patient' && sender !== 'doctor') {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid sender type. Must be either "patient" or "doctor"' 
    });
  }

  try {
    // Create new message
    const newMessage = new Message({
      appointmentId,
      sender,
      message: message.trim(),
      timestamp: new Date(),
      read: false
    });

    // Save to database
    await newMessage.save();
    
    // Return success with the created message
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to save message',
      message: err.message 
    });
  }
};

/**
 * Get message history for a specific appointment
 * @route GET /messages/:appointmentId
 */
const getMessages = async (req, res) => {
  const { appointmentId } = req.params;

  // Validate appointment ID
  if (!appointmentId) {
    return res.status(400).json({ 
      success: false,
      error: 'Appointment ID is required' 
    });
  }

  try {
    // Get messages sorted by timestamp (oldest first)
    const messages = await Message.find({ appointmentId })
      .sort({ timestamp: 1 })
      .lean();  // Use lean for better performance when you don't need mongoose document methods
    
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch messages',
      message: err.message 
    });
  }
};

/**
 * Mark messages as read
 * @route PUT /messages/read/:appointmentId
 */
const markMessagesAsRead = async (req, res) => {
  const { appointmentId } = req.params;
  const { sender } = req.body; // The user marking messages as read

  // Validate inputs
  if (!appointmentId || !sender) {
    return res.status(400).json({ 
      success: false,
      error: 'Appointment ID and sender are required' 
    });
  }

  // Validate sender type
  if (sender !== 'patient' && sender !== 'doctor') {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid sender type. Must be either "patient" or "doctor"' 
    });
  }

  try {
    // Mark messages from the other party as read
    const otherSender = sender === 'patient' ? 'doctor' : 'patient';
    
    const result = await Message.updateMany(
      { appointmentId, sender: otherSender, read: false },
      { read: true }
    );
    
    return res.status(200).json({ 
      success: true, 
      message: 'Messages marked as read',
      messagesUpdated: result.modifiedCount 
    });
  } catch (err) {
    console.error('Error marking messages as read:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to mark messages as read',
      message: err.message 
    });
  }
};

/**
 * Get unread message count for a user
 * @route GET /messages/unread/:userId
 */
const getUnreadCount = async (req, res) => {
  const { userId } = req.params;
  const { userType } = req.query; // 'patient' or 'doctor'

  if (!userId || !userType) {
    return res.status(400).json({ 
      success: false,
      error: 'User ID and user type are required' 
    });
  }

  try {
    // Find appointments related to this user based on userType
    let appointmentQuery = {};
    
    if (userType === 'patient') {
      appointmentQuery = { patientId: userId };
    } else if (userType === 'doctor') {
      appointmentQuery = { doctorId: userId };
    } else {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid user type. Must be either "patient" or "doctor"' 
      });
    }

    // Find the appointments for this user
    // This assumes you have an Appointment model with this structure
    // If not, you'll need to adapt this query to your data model
    const appointments = await mongoose.model('Appointment').find(appointmentQuery)
      .select('_id')
      .lean();
    
    const appointmentIds = appointments.map(apt => apt._id);

    // Get unread message counts
    const otherSender = userType === 'patient' ? 'doctor' : 'patient';
    
    const unreadMessages = await Message.aggregate([
      { 
        $match: { 
          appointmentId: { $in: appointmentIds },
          sender: otherSender,
          read: false
        } 
      },
      {
        $group: {
          _id: '$appointmentId',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format the result
    const result = {};
    unreadMessages.forEach(item => {
      result[item._id] = item.count;
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Error getting unread count:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get unread message count',
      message: err.message 
    });
  }
};

/**
 * Delete messages for an appointment
 * @route DELETE /messages/:appointmentId
 */
const deleteMessages = async (req, res) => {
  const { appointmentId } = req.params;
  
  if (!appointmentId) {
    return res.status(400).json({
      success: false,
      error: 'Appointment ID is required'
    });
  }

  try {
    // Delete all messages for this appointment
    const result = await Message.deleteMany({ appointmentId });
    
    return res.status(200).json({
      success: true,
      message: 'Messages deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('Error deleting messages:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete messages',
      message: err.message
    });
  }
};

/**
 * Search messages by content
 * @route GET /messages/search
 */
const searchMessages = async (req, res) => {
  const { query, appointmentId } = req.query;
  
  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required'
    });
  }

  try {
    // Build the search criteria
    const searchCriteria = {
      message: { $regex: query, $options: 'i' } // Case-insensitive search
    };
    
    // Add appointment filter if provided
    if (appointmentId) {
      searchCriteria.appointmentId = appointmentId;
    }

    // Execute search
    const messages = await Message.find(searchCriteria)
      .sort({ timestamp: -1 }) // Most recent first
      .limit(100) // Limit results
      .lean();
    
    return res.status(200).json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (err) {
    console.error('Error searching messages:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to search messages',
      message: err.message
    });
  }
};

/**
 * Get latest message for each appointment
 * @route GET /messages/latest
 */
const getLatestMessages = async (req, res) => {
  const { userId, userType } = req.query;
  
  if (!userId || !userType) {
    return res.status(400).json({
      success: false,
      error: 'User ID and user type are required'
    });
  }

  try {
    // Find appointments related to this user based on userType
    let appointmentQuery = {};
    
    if (userType === 'patient') {
      appointmentQuery = { patientId: userId };
    } else if (userType === 'doctor') {
      appointmentQuery = { doctorId: userId };
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid user type. Must be either "patient" or "doctor"'
      });
    }

    // Find the appointments for this user
    const appointments = await mongoose.model('Appointment').find(appointmentQuery)
      .select('_id')
      .lean();
    
    const appointmentIds = appointments.map(apt => apt._id.toString());

    // Get the latest message for each appointment
    const latestMessages = await Message.aggregate([
      {
        $match: { appointmentId: { $in: appointmentIds } }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$appointmentId',
          latestMessage: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$latestMessage' }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: latestMessages
    });
  } catch (err) {
    console.error('Error getting latest messages:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to get latest messages',
      message: err.message
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessagesAsRead,
  getUnreadCount,
  deleteMessages,
  searchMessages,
  getLatestMessages
};