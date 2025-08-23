import express from 'express';
import Message from '../models/Message.js';
const router = express.Router();

router.get('/conversation', async (req, res) => {
  const { patientId, providerId } = req.query;
  const room = [patientId, providerId].sort().join('-');
  const messages = await Message.find({ room }).sort({ timestamp: 1 });
  res.json(messages);
});

export default router;