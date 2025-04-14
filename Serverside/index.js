const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: process.env.NODE_ENV === 'production' ? 'https://telemed-connect-frontend.onrender.com' : '*',  // Restrict to your frontend in production
    methods: ['GET', 'POST'],
  },
});

// Importing API routes (your existing routes)
const Router = require('./routes/Route');

// Middleware
app.use(express.json());
app.use(cors()); // Allow cross-origin requests
app.use('/', Router);

// MongoDB connection URL
const MongoURL = process.env.MONGODB_URL;

// WebSocket handling for video call signaling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle joining a room for video chat or messaging
  socket.on('join', (roomId) => {
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);  // Notify the room that a user has joined
  });

  // Handle WebRTC signaling events (for video call handling)
  socket.on('offer', ({ offer, to }) => {
    console.log(`Sending offer from ${socket.id} to ${to}`);
    io.to(to).emit('offer', { offer, from: socket.id });  // Send offer to the target user
  });

  socket.on('answer', ({ answer, to }) => {
    console.log(`Sending answer from ${socket.id} to ${to}`);
    io.to(to).emit('answer', { answer, from: socket.id });  // Send answer to the target user
  });

  socket.on('ice-candidate', ({ candidate, to }) => {
    console.log(`Sending ICE candidate from ${socket.id} to ${to}`);
    io.to(to).emit('ice-candidate', { candidate, from: socket.id });  // Send ICE candidate to the target user
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve static files (React build) and handle React Router
if (process.env.NODE_ENV === 'production') {
  // Serve the static files (React build)
  app.use(express.static(path.join(__dirname, 'dist')));

  // All non-API routes should return the React app's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// MongoDB and server start
mongoose
  .connect(MongoURL)
  .then(() => {
    console.log('MongoDB connected !!');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running at http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
