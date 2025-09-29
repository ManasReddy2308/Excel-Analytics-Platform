// routes/admin.analytics.routes.js
import express from "express";
import { protect, authorizeAdmin } from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import UsageLog from "../models/UsageLog.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/admin/analytics
router.get("/", protect, authorizeAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const activeToday = await UsageLog.distinct("userId", {
      timestamp: { $gte: startOfToday }
    });

    const avgUsage = await UsageLog.aggregate([
      { $group: { _id: "$userId", total: { $sum: "$duration" } } },
      { $group: { _id: null, avg: { $avg: "$total" } } }
    ]);

    const weeklyUsage = await UsageLog.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$timestamp" },
            month: { $month: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1, "_id.day": 1 } }
    ]);

    res.json({
      totalUsers,
      activeToday: activeToday.length,
      avgUsageTime: avgUsage[0]?.avg || 0,
      weeklyUsage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
