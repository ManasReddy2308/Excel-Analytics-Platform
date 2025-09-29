// middleware/upload.middleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads/excels folder exists
const uploadFolder = './uploads/excels';
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for Excel/CSV
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.xlsx', '.xls', '.csv'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel or CSV files are allowed'), false);
  }
};

const uploadMiddleware = multer({ storage, fileFilter });

export default uploadMiddleware;
