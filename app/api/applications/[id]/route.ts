import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { JobApplication } from "@/models/jobApplication";
import { Job } from "@/models/job";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();
    if (!status) {
      return new NextResponse("Status is required", { status: 400 });
    }

    await connectDB();

    // Verify that the user making the request is the employer of the job
    const application = await JobApplication.findById(id).populate({
      path: "jobId",
      model: Job,
    });

    if (!application) {
      return new NextResponse("Application not found", { status: 404 });
    }

    // Check if the current user is the owner of the job
    if ((application.jobId as any).employerId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("[APPLICATION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
