import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['generation', 'download'], // exactly matches what we save in routes
      required: true,
    },
    meta: {
      type: Object, // stores extra info like filename, chart settings, etc.
      default: {},
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

export default mongoose.model('Chart', chartSchema);
