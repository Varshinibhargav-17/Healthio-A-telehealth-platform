import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import Prescription from '../models/Prescription.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage }); // use the storage configuration

// 📤 Upload a prescription (Provider)
router.post('/upload', upload.single('file'), async (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  try {
    const { patientId, providerId, appointmentId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;

    // Use correct field names as per your schema!
    const prescription = new Prescription({
      patient: patientId,
      provider: providerId,
      appointment: appointmentId,
      fileUrl
    });

    await prescription.save();
    res.status(201).json({ message: 'Prescription uploaded successfully', fileUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// Correct order in prescriptionRoutes.js

// 1. Provider + patient
router.get('/:providerId/patient/:patientId', async (req, res) => {
  try {
    const { providerId, patientId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(providerId) || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    console.log('Query:', { provider: providerId, patient: patientId });
    const prescriptions = await Prescription.find({
      provider: providerId,
      patient: patientId
    }).sort({ uploadedAt: -1 });
    console.log('Found:', prescriptions.length);
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// 2. Patient only
router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ error: 'Invalid patient ID format' });
    }
    
    const prescriptions = await Prescription.find({
      patient: patientId
    }).sort({ uploadedAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// 📚 Get prescriptions grouped by appointment (Patient view with filters)
router.get('/by-appointment/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ error: 'Invalid patient ID format' });
    }
    
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('appointment')
      .sort({ uploadedAt: -1 });

    const grouped = {};
    prescriptions.forEach(p => {
      const aId = p.appointment?._id?.toString() || 'Unknown';
      if (!grouped[aId]) {
        grouped[aId] = {
          appointmentId: aId,
          appointmentDate: p.appointment?.date || 'Unknown',
          prescriptions: [],
        };
      }
      grouped[aId].prescriptions.push({
        fileUrl: p.fileUrl,
        uploadedAt: p.uploadedAt,
        _id: p._id,
      });
    });

    res.json(Object.values(grouped));
  } catch (error) {
    console.error('Error fetching prescriptions by appointment:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});


export default router;
