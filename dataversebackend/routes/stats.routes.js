import express from 'express';
import Upload from '../models/upload.js';
import Chart from '../models/Chart.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Track chart generation
router.post('/track-chart', protect, async (req, res) => {
  try {
    console.log('[Track Chart] User:', req.user.userId);
    await Chart.create({
      type: 'generation',
      user: req.user.userId,
      meta: req.body.meta || {}
    });
    res.status(201).json({ message: 'Chart generation tracked successfully' });
  } catch (err) {
    console.error('Track chart error:', err);
    res.status(500).json({ message: 'Error tracking chart generation' });
  }
});

// Track chart download
router.post('/track-download', protect, async (req, res) => {
  try {
    console.log('[Track Download] User:', req.user.userId);
    await Chart.create({
      type: 'download',
      user: req.user.userId,
      meta: req.body.meta || {}
    });
    res.status(201).json({ message: 'Chart download tracked successfully' });
  } catch (err) {
    console.error('Track download error:', err);
    res.status(500).json({ message: 'Error tracking chart download' });
  }
});

// Get user stats
router.get('/user', protect, async (req, res) => {
  try {
    console.log('[Get Stats] User:', req.user.userId);

    const uploads = await Upload.countDocuments({
      uploadedBy: req.user.userId,
      status: 'Completed'
    });

    const charts = await Chart.countDocuments({
      user: req.user.userId,
      type: 'generation'
    });

    const downloads = await Chart.countDocuments({
      user: req.user.userId,
      type: 'download'
    });

    console.log(`[Stats] Uploads: ${uploads}, Charts: ${charts}, Downloads: ${downloads}`);

    res.json({ uploads, charts, downloads });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

export default router;
