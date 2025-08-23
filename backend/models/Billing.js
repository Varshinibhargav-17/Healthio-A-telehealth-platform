import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  amount: { type: Number, required: true, default: 1000 },
  status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Billing", billingSchema);
