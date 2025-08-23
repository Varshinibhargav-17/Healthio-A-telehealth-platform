// server.js

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import patientAuthRoutes from './routes/patientAuth.js';
import providerAuthRoutes from './routes/providerAuth.js';
import messageRoutes from './routes/messages.js';
import { Server } from 'socket.io';
import http from 'http';
import Message from './models/Message.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import billingRoutes from "./routes/billing.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.io setup for messaging and video signaling
const io = new Server(server, {
  cors: { origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Messaging room join
  socket.on('joinRoom', ({ patientId, providerId }) => {
    const room = [patientId, providerId].sort().join('-');
    socket.join(room);
    console.log('Joined room:', room);
  });

  // Messaging send/receive
  socket.on('sendMessage', async ({ room, message, sender, patientId, providerId }) => {
    const msgDoc = new Message({
      room,
      message,
      sender,
      patientId,
      providerId,
      timestamp: new Date()
    });
    await msgDoc.save();
    io.to(room).emit('receiveMessage', {
      message,
      sender,
      patientId,
      providerId,
      timestamp: msgDoc.timestamp
    });
    console.log('Emitting to room:', room, message);
  });

  // Video signaling for WebRTC
  socket.on('join-video-room', ({ appointmentId }) => {
    socket.join(appointmentId);
    console.log('Joined video room:', appointmentId);
  });

  socket.on('signal', ({ appointmentId, data }) => {
    socket.to(appointmentId).emit('signal', data);
    console.log('Signaling in room:', appointmentId, data.type);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Keep this for legacy support
    uri: process.env.MONGO_URI,      // <-- This is the key fix
    collectionName: 'sessions'
  }),
  cookie: { 
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Routes
app.use('/api/patient/auth', patientAuthRoutes);
app.use('/api/provider/auth', providerAuthRoutes);
app.use('/api/messages', messageRoutes);
app.use('/uploads', express.static('uploads')); // serve static files
app.use('/api/prescriptions', prescriptionRoutes);
app.use("/api/billing", billingRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});