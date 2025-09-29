// models/File.js
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: String,
  status: {
    type: String,
    enum: ['Completed', 'Failed', 'Processing'],
    default: 'Processing',
  },
  uploadedBy: String, // or mongoose.Schema.Types.ObjectId if you have auth
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('File', fileSchema);
