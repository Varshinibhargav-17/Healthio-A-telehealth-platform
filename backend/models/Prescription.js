
import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
fileUrl: { type: String, required: true },
uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Prescription', PrescriptionSchema);