const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Update based on your frontend port
    methods: ['GET', 'POST'],
  },
});

// Import API routes
const Router = require('./routes/Route');
app.use('/', Router);

// WebSocket handling
io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);

  // --- Video Call Signaling ---
  socket.on('join', (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const numClients = room ? room.size : 0;
  
    socket.join(roomId);
    console.log(`🟢 User ${socket.id} joined room ${roomId}`);
  
    if (numClients > 1) {
      socket.to(roomId).emit('user-joined', socket.id); // let others know someone joined
      socket.emit('other-user', [...room].find(id => id !== socket.id)); // send back the other user's ID
    }
  });
  

  socket.on('offer', ({ offer, to }) => {
    io.to(to).emit('offer', { offer, from: socket.id });
  });

  socket.on('answer', ({ answer, to }) => {
    io.to(to).emit('answer', { answer, from: socket.id });
  });

  socket.on('ice-candidate', ({ candidate, to }) => {
    io.to(to).emit('ice-candidate', { candidate, from: socket.id });
  });

  // --- Live Chat Handling ---
  socket.on('send-message', ({ roomId, message, sender }) => {
    console.log(`💬 Message from ${sender} in room ${roomId}: ${message}`);
    io.to(roomId).emit('receive-message', { message, sender });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../telemed-connect-ai-care/dist')));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../telemed-connect-ai-care/dist', 'index.html'));
  });
}

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('✅ MongoDB connected!');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}`);
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
