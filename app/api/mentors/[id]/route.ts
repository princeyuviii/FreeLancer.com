import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Mentor } from "@/models/mentor";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const mentor = await Mentor.findById(id);
    if (!mentor) {
      return new NextResponse("Mentor not found", { status: 404 });
    }
    return NextResponse.json(mentor);
  } catch (error) {
    console.error("[MENTOR_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
