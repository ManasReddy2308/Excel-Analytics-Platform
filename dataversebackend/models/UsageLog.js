// models/UsageLog.js
import mongoose from 'mongoose';

const usageLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  activeUsers: { type: Number, default: 0 }
});

// ✅ Prevent OverwriteModelError
export default mongoose.models.UsageLog ||
  mongoose.model('UsageLog', usageLogSchema);
