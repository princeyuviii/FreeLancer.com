import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  username: { type: String },
  email: { type: String },
  role: { type: String },
  experience: { type: String },
  hourlyRate: { type: Number },
  location: { type: String },
  skills: [{ type: String }],
  githubUrl: { type: String },
  linkedinUrl: { type: String },
  escrowBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);