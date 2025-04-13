// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// require('dotenv').config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: '*' } });

// const Router = require('./routes/Route'); // your existing router for API routes

// app.use(express.json());
// app.use(cors());
// app.use('/', Router);

// const PORT = process.env.PORT || 5000;
// const MongoURL = process.env.MONGODB_URL;

// // WebSocket handling for chat and video calls
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // When the patient or doctor joins a chat room based on appointmentId
//   socket.on('join-chat', (roomId) => {
//     console.log(`User ${socket.id} joined chat room ${roomId}`);
//     socket.join(roomId);
//     socket.to(roomId).emit('user-joined', socket.id);  // Notify the room that a user has joined
//   });

//   // Handle sending a message
//   socket.on('send-message', ({ roomId, message, sender }) => {
//     console.log(`Message from ${sender} in room ${roomId}: ${message}`);
//     io.to(roomId).emit('receive-message', { message, sender });  // Broadcast message to the room
//   });

//   // WebRTC signaling events (for video call handling)
//   socket.on('offer', ({ offer, to }) => {
//     console.log(`Sending offer to ${to}`);
//     io.to(to).emit('offer', { offer, from: socket.id });  // Send offer to the target user
//   });

//   socket.on('answer', ({ answer, to }) => {
//     console.log(`Sending answer to ${to}`);
//     io.to(to).emit('answer', { answer, from: socket.id });  // Send answer to the target user
//   });

//   socket.on('ice-candidate', ({ candidate, to }) => {
//     console.log(`Sending ICE candidate to ${to}`);
//     io.to(to).emit('ice-candidate', { candidate, from: socket.id });  // Send ICE candidate to the target user
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//     // You can optionally notify the remaining user that someone left the call or chat
//   });
// });

// // MongoDB and server start
// mongoose
//   .connect(MongoURL)
//   .then(() => {
//     console.log('MongoDB connected !!');
//     server.listen(PORT, () => {
//       console.log(`The server is running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//   });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const Router = require('./routes/Route');

app.use(express.json());
app.use(cors());
app.use('/', Router);

const PORT = process.env.PORT || 5000;
const MongoURL = process.env.MONGODB_URL;

// WebSocket handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
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

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB and server start
mongoose
  .connect(MongoURL)
  .then(() => {
    console.log('MongoDB connected !!');
    server.listen(PORT, () => {
      console.log(`The server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });