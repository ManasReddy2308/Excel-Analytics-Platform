import express from 'express';
import multer from 'multer';
import path from 'path';
import xlsx from 'xlsx';
import fs from 'fs';
import { protect } from '../middleware/auth.middleware.js';
import Chart from '../models/Chart.js';

const router = express.Router();

// Multer config for Excel/CSV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/excels/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xlsx' && ext !== '.xls' && ext !== '.csv') {
      return cb(new Error('Only Excel or CSV files are allowed'));
    }
    cb(null, true);
  }
});

// --------------------
// Chart Processing Route
// --------------------
router.post('/process', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const headers = Object.keys(jsonData[0] || {});

    // ✅ Track chart generation
    await Chart.create({
      user: req.user.userId,
      type: 'generation',
      meta: { filename: req.file.originalname, headers }
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ headers, data: jsonData });
  } catch (err) {
    console.error('Chart processing error:', err);
    res.status(500).json({ message: 'Error processing chart file' });
  }
});

// --------------------
// Track chart generation manually
// --------------------
router.post('/track-chart', protect, async (req, res) => {
  try {
    await Chart.create({
      user: req.user.userId,
      type: 'generation',
      meta: req.body || {}
    });

    res.json({ message: 'Chart generation tracked' });
  } catch (err) {
    console.error('Track chart error:', err);
    res.status(500).json({ message: 'Error tracking chart generation' });
  }
});

// --------------------
// Track chart download
// --------------------
router.post('/track-download', protect, async (req, res) => {
  try {
    await Chart.create({
      user: req.user.userId,
      type: 'download',
      meta: req.body || {}
    });

    res.json({ message: 'Chart download tracked' });
  } catch (err) {
    console.error('Track download error:', err);
    res.status(500).json({ message: 'Error tracking chart download' });
  }
});

export default router;
