import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { JobApplication } from "@/models/jobApplication";
import { Job } from "@/models/job";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    // 1. Find all jobs created by this employer
    const employerJobs = await Job.find({ employerId: userId });
    const jobIds = employerJobs.map((job) => job._id);

    // 2. Find all applications for these jobs
    const applications = await JobApplication.find({
      jobId: { $in: jobIds },
    })
      .populate({ path: "jobId", model: Job })
      .sort({ createdAt: -1 });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("[EMPLOYER_APPLICATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
