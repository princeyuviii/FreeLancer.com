import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.escrowBalance <= 0) {
      return NextResponse.json({ error: "Insufficient balance for withdrawal" }, { status: 400 });
    }

    const amount = user.escrowBalance;
    user.escrowBalance = 0;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      amount,
      message: `Successfully processed withdrawal of ₹${amount}`
    });
  } catch (error) {
    console.error("[WITHDRAW_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
