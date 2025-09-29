import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

// Import Routes
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import chartRoutes from './routes/charts.routes.js';
import statsRoutes from './routes/stats.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import aiRoutes from './routes/ai.routes.js';
import adminAnalyticsRoutes from './routes/admin.analytics.routes.js';
import adminSettingsRoutes from "./routes/adminSettings.routes.js";
// ✅ ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS config
app.use(cors({
  origin: 'http://localhost:5173', // adjust if frontend changes
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Connect to MongoDB
connectDB();

// ✅ Serve full uploads directory so any file path in DB works
// Example: if DB has "uploads/myfile.xlsx", 
// URL will be http://localhost:5000/uploads/myfile.xlsx
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use("/api/admin-settings", adminSettingsRoutes);
// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
