const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app= express()
const Router = require('./routes/Route')
app.use(express.json())
app.use(cors());
require('dotenv').config()
const http = require('http');
const socketIO = require('socket.io');

const PORT = process.env.PORT
const MongoURL = process.env.MONGODB_URL

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
  
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', socket.id);
    });
  
    socket.on('offer', (data) => {
      socket.to(data.roomId).emit('offer', data);
    });
  
    socket.on('answer', (data) => {
      socket.to(data.roomId).emit('answer', data);
    });
  
    socket.on('ice-candidate', (data) => {
      socket.to(data.roomId).emit('ice-candidate', data);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', socket.id);
    });
  }
);

mongoose.connect(MongoURL).then(()=>{
    console.log("MongoDB connected !!")

app.listen(PORT,()=>{
    console.log(`The server is running at ${`http://localhost:5000`}`)
})
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

app.use('/',Router);

