import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  salary: { type: String, required: true },
  posted: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  level: { type: String, required: true },
  category: { type: String, required: true },
  employerId: { type: String, required: true }, // Clerk User ID of the employer
}, { timestamps: true })

export const Job = mongoose.models.Job || mongoose.model('Job', JobSchema)