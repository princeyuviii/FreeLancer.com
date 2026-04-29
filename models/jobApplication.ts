import mongoose from 'mongoose'

const JobApplicationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk User ID
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, enum: ['Pending', 'Reviewing', 'Accepted', 'Rejected', 'Completed'], default: 'Pending' },
}, { timestamps: true })

export const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema)
