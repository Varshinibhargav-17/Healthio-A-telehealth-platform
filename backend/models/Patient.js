import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },

  // Profile info
  first_name: { type: String },
  last_name: { type: String },
  date_of_birth: { type: String },
  age: { type: Number },
  gender: { type: String },
  phone_number: { type: String },
  address: { type: String }
});

export default mongoose.model('Patient', patientSchema);
