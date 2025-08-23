import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  room: String,
  message: String,
  sender: String, // 'patient' or 'provider'
  patientId: String,
  providerId: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);