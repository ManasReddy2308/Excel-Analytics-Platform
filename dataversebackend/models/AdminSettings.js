import mongoose from "mongoose";

const AdminSettingsSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  enableUploads: { type: Boolean, default: true },
  maxUploadSize: { type: Number, default: 10 },
  enableAI: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("AdminSettings", AdminSettingsSchema);
