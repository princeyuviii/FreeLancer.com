import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/booking";
import { Mentor } from "@/models/mentor";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { mentorId, date, topic, paymentStatus } = await req.json();

    await connectDB();
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return new NextResponse("Mentor not found", { status: 404 });
    }

    const booking = await Booking.create({
      studentId: userId,
      mentorId: mentor.clerkId,
      mentorObjectId: mentorId,
      date,
      topic,
      paymentStatus: paymentStatus || "Unpaid",
    });

    // Send confirmation emails
    // In a real app, you'd get the user emails from Clerk or User model
    // For now, we'll log it or use the resend service if configured
    try {
      await resend.emails.send({
        from: "mentors@yuviii.xyz",
        to: "princeyuvraj.tech@gmail.com", // Mock: should be student.email
        subject: `Booking Confirmed: Session with ${mentor.name}`,
        html: `<p>Your session with <b>${mentor.name}</b> on <b>${new Date(date).toLocaleString()}</b> has been booked.</p>`,
      });
    } catch (e) {
      console.error("Email notification failed", e);
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[BOOKINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    const bookings = await Booking.find({ studentId: userId })
      .populate("mentorObjectId")
      .sort({ date: 1 });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[BOOKINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
