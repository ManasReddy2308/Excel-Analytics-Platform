// routes/dashboard.routes.js (create this if needed)
import express from 'express';
import {protect} from '../middleware/auth.middleware.js';
import Chart from '../models/Chart.js';
import File from '../models/File.js';

const router = express.Router();

router.get('/stats', protect, async (req, res) => {
  const chartCount = await Chart.countDocuments({ generatedBy: req.user._id });
  const fileCount = await File.countDocuments({ uploadedBy: req.user._id });
  res.json({ chartCount, fileCount });
});

export default router;
