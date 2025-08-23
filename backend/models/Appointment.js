import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
});

export default mongoose.model('Appointment', appointmentSchema);