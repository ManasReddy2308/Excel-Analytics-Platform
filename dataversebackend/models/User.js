// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    location: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
