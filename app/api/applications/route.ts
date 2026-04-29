import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import { JobApplication } from '@/models/jobApplication';
import { Job } from '@/models/job'; 

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { jobId } = await req.json();
    if (!jobId) {
      return new NextResponse("Job ID is required", { status: 400 });
    }

    await connectDB();

    // Verify job exists
    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return new NextResponse("Job node not found", { status: 404 });
    }

    const existing = await JobApplication.findOne({ userId, jobId });
    if (existing) {
      return new NextResponse("Already applied", { status: 400 });
    }

    const application = await JobApplication.create({ userId, jobId });

    return NextResponse.json(application);
  } catch (error) {
    console.error("[APPLICATIONS_POST]", error);
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
    // Populate job details and filter out applications for deleted jobs
    const applications = await JobApplication.find({ userId })
      .populate({ path: 'jobId', model: Job })
      .sort({ createdAt: -1 })
      .lean();

    const validApplications = applications.filter((app: any) => app.jobId !== null);

    return NextResponse.json(validApplications);
  } catch (error) {
    console.error("[APPLICATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
