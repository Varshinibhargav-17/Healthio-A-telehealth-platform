import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Profile fields
  license_no: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  specialization: { type: String },
  phone_number: { type: String },
  clinic_address: { type: String },
});

export default mongoose.model('Provider', providerSchema);
