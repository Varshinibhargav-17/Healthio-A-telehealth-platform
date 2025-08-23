import express from 'express';
import bcrypt from 'bcrypt';
import Patient from '../models/Patient.js';
import Provider from '../models/Provider.js';
import Appointment from '../models/Appointment.js';

const router = express.Router();

// Middleware to protect routes
function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Unauthorized: Please log in.' });
  }
  next();
}

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existing = await Patient.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = new Patient({ email, username, password: hashedPassword });
    await newPatient.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Patient.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.user = { id: user._id, username: user.username };
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
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

// Get Patient Profile (Protected)
router.get('/profile', requireLogin, async (req, res) => {
  try {
    const patient = await Patient.findById(req.session.user.id).select('-password');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.json(patient);
  } catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or Update Patient Profile (Protected)
router.post('/profile', requireLogin, async (req, res) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    age,
    email,
    phone_number,
    address,
  } = req.body;

  try {
    // Optional: Prevent updating email to one that already exists on another user
    const emailOwner = await Patient.findOne({ email });
    if (emailOwner && emailOwner._id.toString() !== req.session.user.id) {
      return res.status(400).json({ message: 'Email already in use by another account' });
    }

    const updated = await Patient.findByIdAndUpdate(
      req.session.user.id,
      {
        $set: {
          first_name,
          last_name,
          date_of_birth,
          gender, 
          age,
          email,
          phone_number,
          address,
        },
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updated);
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get all providers (public info)
router.get('/providers', async (req, res) => {
  try {
    const providers = await Provider.find({}, '-password');
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/appointments', requireLogin, async (req, res) => {
  const { providerId, date, time } = req.body;
  try {
    const appointment = new Appointment({
      patient: req.session.user.id,
      provider: providerId,
      date,
      time,
      status: 'scheduled',
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/appointments', requireLogin, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.session.user.id,
      
    })
      .populate('provider', 'first_name last_name')
      .sort({ date: 1, time: 1 });
    res.json(appointments.map(app => ({
      ...app.toObject(),
      providerName: app.provider ? `${app.provider.first_name} ${app.provider.last_name}` : ''
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Cancel appointment by patient
router.patch('/appointments/:id/cancel', requireLogin, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patient: req.session.user.id },
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
// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Patient auth route is working!' });
});

export default router;
