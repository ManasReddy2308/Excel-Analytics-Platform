// models/ChartDownload.js

import mongoose from 'mongoose';

const chartDownloadSchema = new mongoose.Schema({
  downloadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ChartDownload', chartDownloadSchema);
