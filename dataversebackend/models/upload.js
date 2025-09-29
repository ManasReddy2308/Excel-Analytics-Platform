import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Completed', 'Processing', 'Failed'],
      default: 'Processing',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent OverwriteModelError in development or hot reload
export default mongoose.models.Upload || mongoose.model('Upload', uploadSchema);
