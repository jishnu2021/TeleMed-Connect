// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');
// require('dotenv').config();
// // Import API routes
// const Router = require('./routes/Route');
// const app = express();

// // Configure CORS to accept requests from allowed origins
// const allowedOrigins = process.env.ALLOWED_ORIGINS 
//   ? process.env.ALLOWED_ORIGINS.split(',') 
//   : ['http://localhost:5173', 'http://localhost:3000','https://telemed-connect.onrender.com', 'https://telemed-connect-backend.onrender.com'];

// app.use(cors({
//   origin: function(origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       console.log(`Origin ${origin} not allowed by CORS`);
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true
// }));

// app.use(express.json());

// const server = http.createServer(app);

// // Set up Socket.IO with proper CORS
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ['GET', 'POST'],
//     credentials: true
//   },
//   pingTimeout: 60000
// });



// app.use('/', Router);

// // Debug logging for all socket connections
// io.use((socket, next) => {
//   console.log(`New socket connection: ${socket.id} from ${socket.handshake.address}`);
//   next();
// });

// // Keep track of rooms and their participants
// const rooms = {};

// // Handle WebSocket connections
// io.on('connection', (socket) => {
//   console.log('🔗 User connected:', socket.id);

//   // Join room handler
//   socket.on('join', (roomId) => {
//     // Validate room ID
//     if (!roomId) {
//       console.error('Attempted to join with empty roomId');
//       return;
//     }

//     console.log(`User ${socket.id} is joining room ${roomId}`);
    
//     // Join the socket.io room
//     socket.join(roomId);
    
//     // Track participants in our rooms object
//     if (!rooms[roomId]) {
//       rooms[roomId] = new Set();
//       // First person to join the room
//       rooms[roomId].add(socket.id);
//       socket.emit('room-created', { roomId });
//       console.log(`Room ${roomId} created by user ${socket.id}`);
//     } else {
//       // Others joining the existing room
//       rooms[roomId].add(socket.id);
//       socket.emit('room-joined', { 
//         roomId, 
//         participants: Array.from(rooms[roomId]).filter(id => id !== socket.id)
//       });
      
//       // Notify other participants about the new joiner
//       socket.to(roomId).emit('user-joined', socket.id);
      
//       console.log(`User ${socket.id} joined existing room ${roomId}`);
//       console.log(`Room ${roomId} now has ${rooms[roomId].size} participants`);
//     }
//   });

//   // WebRTC signaling - Offer
//   socket.on('offer', (data) => {
//     console.log(`Received offer from ${socket.id} in room ${data.roomId}`);
//     // Broadcast the offer to everyone else in the room
//     socket.to(data.roomId).emit('offer', {
//       offer: data.offer,
//       from: socket.id
//     });
//   });

//   // WebRTC signaling - Answer
//   socket.on('answer', (data) => {
//     console.log(`Received answer from ${socket.id} in room ${data.roomId}`);
//     // Send the answer to everyone else in the room
//     socket.to(data.roomId).emit('answer', {
//       answer: data.answer,
//       from: socket.id
//     });
//   });

//   // WebRTC signaling - ICE Candidate
//   socket.on('ice-candidate', (data) => {
//     console.log(`Received ICE candidate from ${socket.id} in room ${data.roomId}`);
//     // Send the ICE candidate to everyone else in the room
//     socket.to(data.roomId).emit('ice-candidate', {
//       candidate: data.candidate,
//       from: socket.id
//     });
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log(`User ${socket.id} disconnected`);
    
//     // Find all rooms this socket was in and notify others
//     for (const [roomId, participants] of Object.entries(rooms)) {
//       if (participants.has(socket.id)) {
//         participants.delete(socket.id);
//         console.log(`Removed ${socket.id} from room ${roomId}`);
        
//         // Notify others in the room
//         socket.to(roomId).emit('user-disconnected', socket.id);
        
//         // Clean up empty rooms
//         if (participants.size === 0) {
//           delete rooms[roomId];
//           console.log(`Room ${roomId} is now empty and has been deleted`);
//         }
//       }
//     }
//   });

//   // Handle explicit leave room request
//   socket.on('leave-room', (roomId) => {
//     if (rooms[roomId] && rooms[roomId].has(socket.id)) {
//       rooms[roomId].delete(socket.id);
//       socket.leave(roomId);
//       console.log(`User ${socket.id} left room ${roomId}`);
      
//       // Notify others in the room
//       socket.to(roomId).emit('user-disconnected', socket.id);
      
//       // Clean up empty rooms
//       if (rooms[roomId].size === 0) {
//         delete rooms[roomId];
//         console.log(`Room ${roomId} is now empty and has been deleted`);
//       }
//     }
//   });

//   // Live chat functionality
// // Socket.IO messaging section (replace in server.js)

// // Live chat functionality
// socket.on('send-message', (messageData) => {
//   const { appointmentId, message, sender, timestamp } = messageData;
  
//   if (!appointmentId) {
//     console.error('Missing appointmentId in message');
//     return;
//   }
  
//   console.log(`💬 Message from ${sender} in appointment ${appointmentId}: ${message}`);
  
//   // Generate a unique ID for the message
//   const messageId = Math.random().toString(36).substring(2, 9);
  
//   // Create the message object
//   const completeMessage = { 
//     appointmentId,
//     message, 
//     sender,
//     timestamp: timestamp || new Date().toISOString(),
//     id: messageId
//   };
  
//   // Broadcast message to everyone in the room (appointment)
//   io.to(appointmentId).emit('receive-message', completeMessage);
// });

// // Handle typing indicator
// socket.on('typing', ({ sender, appointmentId }) => {
//   if (!appointmentId) return;
  
//   console.log(`👆 ${sender} is typing in appointment ${appointmentId}`);
//   socket.to(appointmentId).emit('typing', { sender, appointmentId });
// });
// });

// // Health check endpoint for Render
// app.get('/health', (req, res) => {
//   res.status(200).send('OK');
// });

// // Debug endpoint to view active rooms (only in development)
// if (process.env.NODE_ENV !== 'production') {
//   app.get('/debug/rooms', (req, res) => {
//     const roomsInfo = {};
//     for (const [roomId, participants] of Object.entries(rooms)) {
//       roomsInfo[roomId] = Array.from(participants);
//     }
//     res.json({ rooms: roomsInfo });
//   });
// }

// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/dist')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//   });
// }

// // Connect to MongoDB and start server
// const PORT = process.env.PORT || 5000;
// const MONGODB_URL = process.env.MONGODB_URL;

// if (!MONGODB_URL) {
//   console.error('❌ MongoDB URL is not defined. Check your environment variables.');
//   process.exit(1);
// }

// mongoose.connect(MONGODB_URL)
//   .then(() => {
//     console.log('✅ MongoDB connected!');
//     server.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//       console.log(`Socket.IO server accepting connections from: ${allowedOrigins.join(', ')}`);
//     });
//   })
//   .catch((error) => {
//     console.error('❌ MongoDB connection error:', error);
//   });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   await mongoose.disconnect();
//   server.close(() => {
//     console.log('🛑 Server closed gracefully');
//     process.exit(0);
//   });
// });

// process.on('SIGTERM', async () => {
//   await mongoose.disconnect();
//   server.close(() => {
//     console.log('🛑 Server closed gracefully');
//     process.exit(0);
//   });
// });

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
