// controllers/user.controller.js
import Upload from '../models/upload.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Upload from '../models/upload.model.js';
// GET /api/user/me
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// PUT /api/user/me
export const updateProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      location: req.body.location,
    };

    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
    }).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

// PUT /api/user/me/password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error });
  }
};

// DELETE /api/user/me
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error });
  }
};


export const getUploadHistory = async (req, res) => {
  try {
    const uploads = await Upload.find({ uploadedBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(uploads);
  } catch (err) {
    console.error('Error fetching upload history:', err);
    res.status(500).json({ message: 'Failed to fetch upload history' });
  }
};
