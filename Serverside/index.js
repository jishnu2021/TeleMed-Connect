const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const Router = require('./routes/Route');
const app = express();

// Allow cross-origin requests
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : [
      'http://localhost:5173', 
      'http://localhost:3000',
      'https://telemed-connect.onrender.com', 
    ];

    app.use(cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }));
    

app.use(express.json());
app.use('/', Router);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000
});

const rooms = {};

// WebSocket Connections
io.on('connection', (socket) => {
  console.log(`🔗 Connected: ${socket.id}`);

  socket.on('join', (roomId) => {
    if (!roomId) return console.error('❌ Empty roomId');
    socket.join(roomId);
    rooms[roomId] = rooms[roomId] || new Set();
    rooms[roomId].add(socket.id);

    const isFirst = rooms[roomId].size === 1;
    socket.emit(isFirst ? 'room-created' : 'room-joined', {
      roomId, 
      participants: Array.from(rooms[roomId]).filter(id => id !== socket.id)
    });

    if (!isFirst) {
      socket.to(roomId).emit('user-joined', socket.id);
    }
  });

  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('offer', { offer, from: socket.id });
  });

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('answer', { answer, from: socket.id });
  });

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', { candidate, from: socket.id });
  });

  socket.on('send-message', ({ appointmentId, message, sender, timestamp }) => {
    if (!appointmentId) return console.error('❌ No appointmentId');
    const completeMessage = { 
      appointmentId, 
      message, 
      sender, 
      timestamp: timestamp || new Date().toISOString(), 
      id: Math.random().toString(36).substring(2, 9)
    };
    io.to(appointmentId).emit('receive-message', completeMessage);
  });

  socket.on('typing', ({ sender, appointmentId }) => {
    socket.to(appointmentId).emit('typing', { sender });
  });

  socket.on('leave-room', (roomId) => {
    if (rooms[roomId]?.has(socket.id)) {
      rooms[roomId].delete(socket.id);
      socket.leave(roomId);
      socket.to(roomId).emit('user-disconnected', socket.id);
      if (rooms[roomId].size === 0) delete rooms[roomId];
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Disconnected: ${socket.id}`);
    for (const [roomId, participants] of Object.entries(rooms)) {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        socket.to(roomId).emit('user-disconnected', socket.id);
        if (participants.size === 0) delete rooms[roomId];
      }
    }
  });
});

// Health Check
app.get('/health', (req, res) => res.send('OK'));

// Debug active rooms (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.get('/debug/rooms', (req, res) => {
    res.json({ rooms: Object.fromEntries(
      Object.entries(rooms).map(([roomId, participants]) => [roomId, Array.from(participants)])
    )});
  });
}

// Serve static files (production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../telemed-connect-ai-care/dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../telemed-connect-ai-care/dist/index.html')));
}

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error('❌ MONGODB_URL not defined');
  process.exit(1);
}

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Graceful shutdown
const shutdown = async () => {
  await mongoose.disconnect();
  server.close(() => {
    console.log('🛑 Server closed gracefully');
    process.exit(0);
  });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
