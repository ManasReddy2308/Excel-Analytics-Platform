// routes/upload.routes.js
import express from "express";
import path from "path";
import fs from "fs";
import { protect } from "../middleware/auth.middleware.js";
import Upload from "../models/upload.js";
import upload from "../middleware/upload.middleware.js"; // ✅ centralized multer middleware

const router = express.Router();

// Test GET to verify route is alive
router.get("/", (req, res) => {
  res.json({ message: "Uploads API is working" });
});

// Upload file (protected)
router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Ensure userId exists
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User ID missing in token/middleware" });
    }

    const newUpload = await Upload.create({
      filename: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      status: "Completed",
      uploadedBy: userId, // always valid now
    });

    res.status(201).json({
      message: "File uploaded successfully",
      upload: newUpload,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload file", error: error.message });
  }
});

// Get user upload history (protected)
router.get("/history", protect, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User ID missing in token/middleware" });
    }

    const uploads = await Upload.find({ uploadedBy: userId }).sort({ createdAt: -1 });

    res.json(uploads);
  } catch (error) {
    console.error("Upload history error:", error);
    res.status(500).json({ message: "Failed to fetch upload history" });
  }
});

export default router;
