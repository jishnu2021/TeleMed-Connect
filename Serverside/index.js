const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();

// Configure CORS to accept requests from allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      console.log(`Origin ${origin} not allowed by CORS`);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);

// Set up Socket.IO with proper CORS
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins during development
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000 // Increase timeout for better connection stability
});

// Import API routes
const Router = require('./routes/Route');
app.use('/', Router);

// Debug logging for all socket connections
io.use((socket, next) => {
  console.log(`New socket connection: ${socket.id} from ${socket.handshake.address}`);
  next();
});

// Keep track of rooms and their participants
const rooms = {};

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);

  // Join room handler
  socket.on('join', (roomId) => {
    // Validate room ID
    if (!roomId) {
      console.error('Attempted to join with empty roomId');
      return;
    }

    console.log(`User ${socket.id} is joining room ${roomId}`);
    
    // Join the socket.io room
    socket.join(roomId);
    
    // Track participants in our rooms object
    if (!rooms[roomId]) {
      rooms[roomId] = new Set();
      // First person to join the room
      rooms[roomId].add(socket.id);
      socket.emit('room-created', { roomId });
      console.log(`Room ${roomId} created by user ${socket.id}`);
    } else {
      // Others joining the existing room
      rooms[roomId].add(socket.id);
      socket.emit('room-joined', { 
        roomId, 
        participants: Array.from(rooms[roomId]).filter(id => id !== socket.id)
      });
      
      // Notify other participants about the new joiner
      socket.to(roomId).emit('user-joined', socket.id);
      
      console.log(`User ${socket.id} joined existing room ${roomId}`);
      console.log(`Room ${roomId} now has ${rooms[roomId].size} participants`);
    }
  });

  // WebRTC signaling - Offer
  socket.on('offer', (data) => {
    console.log(`Received offer from ${socket.id} in room ${data.roomId}`);
    // Broadcast the offer to everyone else in the room
    socket.to(data.roomId).emit('offer', {
      offer: data.offer,
      from: socket.id
    });
  });

  // WebRTC signaling - Answer
  socket.on('answer', (data) => {
    console.log(`Received answer from ${socket.id} in room ${data.roomId}`);
    // Send the answer to everyone else in the room
    socket.to(data.roomId).emit('answer', {
      answer: data.answer,
      from: socket.id
    });
  });

  // WebRTC signaling - ICE Candidate
  socket.on('ice-candidate', (data) => {
    console.log(`Received ICE candidate from ${socket.id} in room ${data.roomId}`);
    // Send the ICE candidate to everyone else in the room
    socket.to(data.roomId).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.id
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    
    // Find all rooms this socket was in and notify others
    for (const [roomId, participants] of Object.entries(rooms)) {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        console.log(`Removed ${socket.id} from room ${roomId}`);
        
        // Notify others in the room
        socket.to(roomId).emit('user-disconnected', socket.id);
        
        // Clean up empty rooms
        if (participants.size === 0) {
          delete rooms[roomId];
          console.log(`Room ${roomId} is now empty and has been deleted`);
        }
      }
    }
  });

  // Handle explicit leave room request
  socket.on('leave-room', (roomId) => {
    if (rooms[roomId] && rooms[roomId].has(socket.id)) {
      rooms[roomId].delete(socket.id);
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
      
      // Notify others in the room
      socket.to(roomId).emit('user-disconnected', socket.id);
      
      // Clean up empty rooms
      if (rooms[roomId].size === 0) {
        delete rooms[roomId];
        console.log(`Room ${roomId} is now empty and has been deleted`);
      }
    }
  });

  // Live chat functionality
// Socket.IO messaging section (replace in server.js)

// Live chat functionality
socket.on('send-message', (messageData) => {
  const { appointmentId, message, sender, timestamp } = messageData;
  
  if (!appointmentId) {
    console.error('Missing appointmentId in message');
    return;
  }
  
  console.log(`💬 Message from ${sender} in appointment ${appointmentId}: ${message}`);
  
  // Generate a unique ID for the message
  const messageId = Math.random().toString(36).substring(2, 9);
  
  // Create the message object
  const completeMessage = { 
    appointmentId,
    message, 
    sender,
    timestamp: timestamp || new Date().toISOString(),
    id: messageId
  };
  
  // Broadcast message to everyone in the room (appointment)
  io.to(appointmentId).emit('receive-message', completeMessage);
});

// Handle typing indicator
socket.on('typing', ({ sender, appointmentId }) => {
  if (!appointmentId) return;
  
  console.log(`👆 ${sender} is typing in appointment ${appointmentId}`);
  socket.to(appointmentId).emit('typing', { sender, appointmentId });
});
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Debug endpoint to view active rooms (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.get('/debug/rooms', (req, res) => {
    const roomsInfo = {};
    for (const [roomId, participants] of Object.entries(rooms)) {
      roomsInfo[roomId] = Array.from(participants);
    }
    res.json({ rooms: roomsInfo });
  });
}

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error('❌ MongoDB URL is not defined. Check your environment variables.');
  process.exit(1);
}

mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('✅ MongoDB connected!');
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`Socket.IO server accepting connections from: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  server.close(() => {
    console.log('🛑 Server closed gracefully');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  await mongoose.disconnect();
  server.close(() => {
    console.log('🛑 Server closed gracefully');
    process.exit(0);
  });
});