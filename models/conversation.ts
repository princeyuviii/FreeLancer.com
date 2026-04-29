import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: String, required: true }], // Array of Clerk User IDs
    lastMessage: {
      text: String,
      senderId: String,
      createdAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

// Index participants for faster queries
ConversationSchema.index({ participants: 1 });

export const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
