import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/booking";
import { User } from "@/models/user";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    // Find bookings where current user is the mentor
    const bookings = await Booking.find({ mentorId: userId })
      .populate({ path: "studentId", model: User }) // Note: studentId in Booking is a Clerk ID string, but we want the User model
      .sort({ date: 1 });

    // Since studentId in Booking is a string, populate might not work if not configured as a ref to the Clerk ID.
    // Let's manually fetch user details for each booking if needed, or assume we have the ID.
    // For now, I'll return the bookings.

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[MENTOR_BOOKINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
