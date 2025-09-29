// controllers/upload.controller.js
import fs from 'fs';
import path from 'path';
import Upload from '../models/upload.js';

// 📥 GET /api/uploads/history - Get Upload History for the authenticated user
export const getUploadHistory = async (req, res) => {
  try {
    const uploads = await Upload.find({ uploadedBy: req.user.userId }).sort({ createdAt: -1 });

    const uploadsWithSizes = uploads.map(upload => {
      const filename = upload.filename || '';
      const filePath = path.resolve('uploads', 'excels', filename);
      let sizeInBytes = 0;

      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        sizeInBytes = stats.size;
      }

      return {
        filename: filename,
        size: (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB',
        date: upload.createdAt.toISOString().split('T')[0],
        status: upload.status || 'Unknown',
      };
    });

    res.status(200).json(uploadsWithSizes);
  } catch (err) {
    console.error('❌ Error fetching upload history:', err);
    res.status(500).json({ message: 'Failed to fetch upload history' });
  }
};
