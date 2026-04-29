import mongoose from 'mongoose'

const MentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expertise: { type: String, required: true },
  rating: { type: Number, required: true },
  hourlyRate: { type: Number, required: true },
  image: { type: String, required: true },
  specialties: [{ type: String }],
  availability: { type: String, required: true },
  country: { type: String, required: true },
  clerkId: { type: String, required: true }, // Clerk User ID of the mentor
}, { timestamps: true })

export const Mentor = mongoose.models.Mentor || mongoose.model('Mentor', MentorSchema)
