// routes/user.routes.js
import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
} from '../controllers/user.controller.js';

const router = express.Router();

// ✅ Multer storage config for avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/avatars';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

// ✅ Only allow image files
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

const upload = multer({ storage, fileFilter });

// ✅ Routes
router.get('/me', protect, getProfile);
router.put('/me', protect, upload.single('avatar'), updateProfile);
router.put('/me/password', protect, updatePassword);
router.delete('/me', protect, deleteAccount);

export default router;
