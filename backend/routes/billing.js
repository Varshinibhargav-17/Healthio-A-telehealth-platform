 import express from "express";
import Billing from "../models/Billing.js";
import Appointment from "../models/Appointment.js";
import requireLogin from "../middleware/requireLogin.js";


const router = express.Router();

// Provider creates bill - supports both appointment-based and direct patient billing
router.post("/create", requireLogin, async (req, res) => {
  try {
    const { appointmentId, patientId, amount } = req.body;
    let billData = {
      provider: req.session.providerId,
      amount: amount || 1000, // use provided amount or default to 1000
    };

    if (appointmentId) {
      // Create bill from appointment
      const appointment = await Appointment.findById(appointmentId).populate("patient");
      if (!appointment) return res.status(404).json({ error: "Appointment not found" });
      
      billData.appointment = appointment._id;
      billData.patient = appointment.patient._id;
    } else if (patientId) {
      // Create bill directly for patient
      billData.patient = patientId;
    } else {
      return res.status(400).json({ error: "Either appointmentId or patientId is required" });
    }

    const bill = new Billing(billData);
    await bill.save();
    
    // Populate patient info for response
    await bill.populate('patient', 'name first_name last_name email');
    res.json(bill);
  } catch (err) {
    console.error("Error creating bill:", err);
    res.status(500).json({ error: "Failed to create bill" });
  }
});

// Patient views bills
router.get("/my-bills", requireLogin, async (req, res) => {
  try {
    // Check if user is logged in as patient
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "Patient authentication required" });
    }
    
    const bills = await Billing.find({ patient: req.session.user.id })
      .populate("provider", "first_name last_name specialization")
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    console.error("Error fetching patient bills:", err);
    res.status(500).json({ error: "Failed to fetch bills" });
  }
});

// Patient pays bill (mock)
router.post("/pay/:id", requireLogin, async (req, res) => {
  try {
    // Check if user is logged in as patient
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "Patient authentication required" });
    }

    const bill = await Billing.findById(req.params.id);
    if (!bill) return res.status(404).json({ error: "Bill not found" });

    // Check if the bill belongs to the logged-in patient
    if (bill.patient.toString() !== req.session.user.id) {
      return res.status(403).json({ error: "Not authorized to pay this bill" });
    }

    bill.status = "Paid";
    await bill.save();

    res.json({ message: "Payment successful (mock)", bill });
  } catch (err) {
    console.error("Error processing payment:", err);
    res.status(500).json({ error: "Payment failed" });
  }
});

// Provider views bills they issued
router.get("/issued", requireLogin, async (req, res) => {
  try {
    const bills = await Billing.find({ provider: req.session.providerId }).populate("patient");
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bills" });
  }
});
// GET all patients for the logged-in provider
// routes/billing.js
router.get("/patients", requireLogin, async (req, res) => {
  try {
    const appointments = await Appointment.find({ provider: req.session.providerId }).populate("patient");
    
    // Check if appointments have patients
    const appointmentsWithPatients = appointments.filter(app => app.patient);
    
    const uniquePatients = [...new Map(
      appointmentsWithPatients.map(a => [a.patient._id.toString(), a.patient])
    ).values()];
    
    res.json(uniquePatients);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});
router.get("/provider-bills", requireLogin, async (req, res) => {
  try {
    const bills = await Billing.find({ provider: req.session.providerId })
      .populate("patient", "name email") // fetch patient details
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (err) {
    console.error("Error fetching bills:", err);
    res.status(500).json({ message: "Server error" });
  }
});





export default router;
