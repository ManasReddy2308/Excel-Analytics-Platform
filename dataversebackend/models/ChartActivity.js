import mongoose from 'mongoose';

const ChartActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chartType: {
      type: String,
      required: true,
    },
    mode: {
      type: String, // '2d' or '3d'
      enum: ['2d', '3d'],
      required: true,
    },
    fileName: String,
  },
  { timestamps: true }
);

export default mongoose.model('ChartActivity', ChartActivitySchema);
