// routes/admin.routes.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Upload from '../models/upload.js';
import { protect, authorizeAdmin } from '../middleware/auth.middleware.js';
import UsageLog from "../models/UsageLog.js"; 

const router = express.Router();

// Helper: format bytes -> human readable (GB)
function formatBytesToGB(bytes) {
  if (!bytes || isNaN(bytes)) return '0 GB';
  const gb = bytes / 1024 / 1024 / 1024;
  return `${gb.toFixed(2)} GB`;
}

/* =========================================================
   DASHBOARD STATS
========================================================= */

router.get('/dashboard', protect, authorizeAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({ updatedAt: { $gte: sevenDaysAgo } });

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newRegistrations = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });

    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const prev7Start = fourteenDaysAgo;
    const prev7End = sevenDaysAgo;

    const last7Regs = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const prev7Regs = await User.countDocuments({
      createdAt: { $gte: prev7Start, $lt: prev7End }
    });

    const calcTrend = (current, previous) => {
      if (!previous) return current ? `+${current}` : '+0%';
      const diff = current - previous;
      const pct = ((diff / previous) * 100).toFixed(1);
      return `${diff >= 0 ? '+' : ''}${pct}%`;
    };

    const registrationsTrend = calcTrend(last7Regs, prev7Regs);

    // Disk usage calculation
    const uploadsDir = path.join(process.cwd(), 'uploads');
    let totalSize = 0;
    if (fs.existsSync(uploadsDir)) {
      const walk = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          const full = path.join(dir, e.name);
          if (e.isDirectory()) walk(full);
          else {
            try {
              totalSize += fs.statSync(full).size;
            } catch {}
          }
        }
      };
      walk(uploadsDir);
    }
    const diskUsage = formatBytesToGB(totalSize);

    res.json({
      totalUsers,
      activeUsers,
      newRegistrations,
      diskUsage,
      trends: { newRegistrations: registrationsTrend }
    });
  } catch (err) {
    console.error('Admin /dashboard error', err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

/* =========================================================
   ENGAGEMENT DATA
========================================================= */

router.get('/engagement', protect, authorizeAdmin, async (req, res) => {
  try {
    const results = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(dayStart.getDate() - i);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await Upload.countDocuments({
        createdAt: { $gte: dayStart, $lte: dayEnd }
      });

      results.push({ date: dayStart.toISOString().slice(0, 10), uploads: count });
    }
    res.json(results);
  } catch (err) {
    console.error('Admin /engagement error', err);
    res.status(500).json({ message: 'Failed to fetch engagement data' });
  }
});

/* =========================================================
   SYSTEM HEALTH
========================================================= */

router.get('/system-health', protect, authorizeAdmin, async (req, res) => {
  try {
    const loadAvg = os.loadavg()[0];
    const cpuPercent = ((loadAvg / os.cpus().length) * 100).toFixed(1);

    const memTotal = os.totalmem();
    const memFree = os.freemem();
    const memUsed = memTotal - memFree;
    const memPercent = ((memUsed / memTotal) * 100).toFixed(1);

    res.json({
      cpuPercent: Number(cpuPercent),
      memoryPercent: Number(memPercent)
    });
  } catch (err) {
    console.error('Admin /system-health error', err);
    res.status(500).json({ message: 'Failed to fetch system health' });
  }
});

/* =========================================================
   STORAGE TREND
========================================================= */

router.get('/storage-trend', protect, authorizeAdmin, async (req, res) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const dayBuckets = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      dayBuckets[d.toISOString().slice(0, 10)] = 0;
    }

    if (fs.existsSync(uploadsDir)) {
      const walkFiles = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          const full = path.join(dir, e.name);
          if (e.isDirectory()) walkFiles(full);
          else {
            try {
              const st = fs.statSync(full);
              const dateStr = new Date(st.mtime).toISOString().slice(0, 10);
              if (dateStr in dayBuckets) {
                dayBuckets[dateStr] += st.size;
              }
            } catch {}
          }
        }
      };
      walkFiles(uploadsDir);
    }

    const output = Object.keys(dayBuckets).map((date) => ({
      date,
      sizeGB: Number((dayBuckets[date] / (1024 ** 3)).toFixed(3))
    }));

    res.json(output);
  } catch (err) {
    console.error('Admin /storage-trend error', err);
    res.status(500).json({ message: 'Failed to fetch storage trend' });
  }
});

/* =========================================================
   RECENT ACTIVITY
========================================================= */

router.get('/recent-activity', protect, authorizeAdmin, async (req, res) => {
  try {
    const uploads = await Upload.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('uploadedBy', 'name email');

    const logs = uploads.map((u) => {
      const user = u.uploadedBy ? `${u.uploadedBy.name || u.uploadedBy.email}` : 'Unknown';
      return {
        time: u.createdAt,
        message: `📁 ${u.filename} uploaded by ${user}`,
        type: 'upload'
      };
    });

    res.json(logs);
  } catch (err) {
    console.error('Admin /recent-activity error', err);
    res.status(500).json({ message: 'Failed to fetch recent activity' });
  }
});

/* =========================================================
   USER MANAGEMENT
========================================================= */

// GET all users (without password)
router.get('/users', protect, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'email status createdAt').select('-password');
    res.json(users);
  } catch (err) {
    console.error('Admin /users error', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// UPDATE user email, password, and/or status
router.put('/users/:id', protect, authorizeAdmin, async (req, res) => {
  try {
    const { email, password, status } = req.body;
    const updateData = {};

    if (email) updateData.email = email;
    if (status !== undefined) updateData.status = status; // ✅ handles both true & false
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, select: 'email status createdAt' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Admin update /users/:id error', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// DELETE user
router.delete('/users/:id', protect, authorizeAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: `User ${user.email} deleted successfully` });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get("/analytics", protect, authorizeAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    // Active today: users who logged in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await UsageLog.countDocuments({ date: { $gte: today } });

    // Avg usage time: mean of all sessions
    const avgUsageAgg = await UsageLog.aggregate([
      { $group: { _id: null, avgTime: { $avg: "$duration" } } }
    ]);
    const avgUsageTime = avgUsageAgg.length ? Math.round(avgUsageAgg[0].avgTime) : 0;

    // Weekly trend: group by day
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    const weeklyTrend = await UsageLog.aggregate([
      { $match: { date: { $gte: weekAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const labels = [];
    const values = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      labels.push(dateStr);
      const found = weeklyTrend.find(w => w._id === dateStr);
      values.push(found ? found.total : 0);
    }

    res.json({
      totalUsers,
      activeToday,
      avgUsageTime,
      weekly: { labels, values }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.get('/reports', protect, authorizeAdmin, async (req, res) => {
  try {
    const uploads = await Upload.find()
      .populate('uploadedBy', 'email')
      .sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
