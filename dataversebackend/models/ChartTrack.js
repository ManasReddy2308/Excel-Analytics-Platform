// models/ChartTrack.js
import mongoose from 'mongoose';

const chartTrackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, enum: ['generate', 'download'], default: 'generate' },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('ChartTrack', chartTrackSchema);
