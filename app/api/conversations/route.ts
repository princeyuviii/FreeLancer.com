import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { Conversation } from "@/models/conversation";
import { Mentor } from "@/models/mentor";
import { User } from "@/models/user";
import { Job } from "@/models/job";

// GET /api/conversations - Get all conversations for the current user
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    // Find conversations where the current user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    }).sort({ updatedAt: -1 }).lean();

    // Enrich conversations with participant details
    const enrichedConversations = await Promise.all(conversations.map(async (conv: any) => {
      const otherId = conv.participants.find((id: string) => id !== userId);
      
      // Try to find in Mentor collection first
      let otherUser = await Mentor.findOne({ clerkId: otherId }).select('name image').lean();
      
      // If not a mentor, try User collection
      if (!otherUser) {
        otherUser = await User.findOne({ clerkId: otherId }).select('username image').lean();
      }

      // If still not found, check Job collection (for employers)
      let companyName = null;
      if (!otherUser) {
        const job = await Job.findOne({ employerId: otherId }).select('company').lean();
        if (job) companyName = job.company;
      }

      return {
        ...conv,
        otherParticipant: {
          id: otherId,
          name: otherUser?.name || otherUser?.username || companyName || `User_${otherId?.substring(0, 6)}`,
          image: otherUser?.image || null
        }
      };
    }));

    return NextResponse.json(enrichedConversations);
  } catch (error) {
    console.error("[CONVERSATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST /api/conversations - Start a new conversation
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { participantId } = await req.json();
    if (!participantId) {
      return new NextResponse("Participant ID is required", { status: 400 });
    }

    await connectDB();

    // Check if a conversation already exists between these two participants
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, participantId],
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("[CONVERSATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
