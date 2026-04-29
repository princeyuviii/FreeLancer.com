import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true }, // Clerk User ID
    mentorId: { type: String, required: true }, // Clerk User ID
    mentorObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Refunded"],
      default: "Unpaid",
    },
    topic: { type: String },
  },
  { timestamps: true }
);

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
