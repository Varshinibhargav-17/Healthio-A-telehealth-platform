import express from 'express';
import Provider from '../models/Provider.js';
import bcrypt from 'bcryptjs';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';


const router = express.Router();

// Middleware to protect routes (same style as patient)
function requireLogin(req, res, next) {
  if (!req.session || !req.session.providerId) {
    return res.status(401).json({ message: 'Unauthorized: Please log in.' });
  }
  next();
}

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const existingUser = await Provider.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newProvider = new Provider({ email, username, password: hashedPassword });
    await newProvider.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const provider = await Provider.findOne({ username });
    if (!provider) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    req.session.providerId = provider._id;
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Get Provider Profile (Protected)
router.get('/profile', requireLogin, async (req, res) => {
  try {
    const provider = await Provider.findById(req.session.providerId).select('-password');
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or Update Provider Profile (Protected)
router.post('/profile', requireLogin, async (req, res) => {
  const profileData = req.body;
  try {
    const updatedProvider = await Provider.findByIdAndUpdate(
      req.session.providerId,
      profileData,
      { new: true, runValidators: true }
    ).select('-password');
    res.json(updatedProvider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/appointments', requireLogin, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      provider: req.session.providerId // <-- FIXED HERE
    })
      .populate('patient', '-password') // Get full patient profile except password
      .sort({ date: 1, time: 1 });

    res.json(
      appointments.map(app => ({
        _id: app._id,
        patientName: app.patient ? `${app.patient.first_name} ${app.patient.last_name}` : '',
        date: app.date,
        time: app.time,
        status: app.status,
        patient: app.patient, // Full patient profile for "View Profile"
      }))
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel appointment by provider
router.patch('/appointments/:id/cancel', requireLogin, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, provider: req.session.providerId },
      { status: 'canceled' },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or not authorized' });
    }
    res.json({ message: 'Appointment canceled', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// GET all patients for the logged-in provider
// GET all patients for the logged-in provider
router.get('/patients', requireLogin, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      provider: req.session.providerId,
      status: { $ne: 'canceled' } // Exclude canceled appointments
    }).populate('patient');
    const uniquePatients = [...new Map(appointments.map(a => [a.patient._id.toString(), a.patient])).values()];
    res.json(uniquePatients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patients.' });
  }
});

export default router;
