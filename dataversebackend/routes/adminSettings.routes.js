// routes/adminSettings.routes.js
import express from "express";
import { protect, authorizeAdmin } from "../middleware/auth.middleware.js";
import AdminSettings from "../models/AdminSettings.js";
import User from "../models/User.js";

const router = express.Router();

// GET admin settings
router.get("/", protect, authorizeAdmin, async (req, res) => {
  try {
    const settings = await AdminSettings.findOne({ adminId: req.user.userId });
    const admin = await User.findById(req.user.userId).select("name email");
    res.json({ admin, settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admin settings" });
  }
});

// UPDATE account info
router.put("/account", protect, authorizeAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await User.findById(req.user.userId);

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) admin.password = password; // hashed via pre-save hook

    await admin.save();
    res.json({ message: "Account updated", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update account" });
  }
});

// UPDATE system preferences
router.put("/preferences", protect, authorizeAdmin, async (req, res) => {
  try {
    const { enableUploads, maxUploadSize, enableAI } = req.body;

    let settings = await AdminSettings.findOne({ adminId: req.user.userId });
    if (!settings) {
      settings = new AdminSettings({ adminId: req.user.userId });
    }

    if (enableUploads !== undefined) settings.enableUploads = enableUploads;
    if (maxUploadSize !== undefined) settings.maxUploadSize = maxUploadSize;
    if (enableAI !== undefined) settings.enableAI = enableAI;

    await settings.save();
    res.json({ message: "Preferences updated", settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update preferences" });
  }
});

export default router;
