import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    let dbUser = await User.findOne({ clerkId: userId });
    
    if (!dbUser) {
      const user = await currentUser();
      dbUser = await User.create({
        clerkId: userId,
        email: user?.emailAddresses[0]?.emailAddress,
        username: user?.username || user?.firstName,
        role: "Freelancer",
        experience: "Beginner",
        hourlyRate: 15,
        location: "Remote",
        skills: ["React", "Next.js", "Node.js"],
        githubUrl: "",
        linkedinUrl: "",
      });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { z } from 'zod';

const profileSchema = z.object({
  username: z.string().min(2).optional(),
  role: z.string().optional(),
  experience: z.string().optional(),
  hourlyRate: z.number().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
});

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    // Clean data: remove fields that shouldn't be updated directly via this schema
    const { clerkId, _id, createdAt, __v, ...updateData } = body;
    
    const validation = profileSchema.safeParse(updateData);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return NextResponse.json({ errors }, { status: 400 });
    }

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: validation.data },
      { new: true, upsert: true } // Use upsert: true just in case
    );

    if (!updatedUser) {
      return new NextResponse("User not found and could not be created", { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PROFILE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
