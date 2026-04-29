import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db'
import { Job } from '@/models/job'

import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(3),
  company: z.string().min(2),
  description: z.string().min(10),
  salary: z.string(),
  skills: z.array(z.string()),
  type: z.string(),
  location: z.string(),
  level: z.string(),
  category: z.string(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validation = jobSchema.safeParse(body);
    
    if (!validation.success) {
      return new NextResponse(JSON.stringify(validation.error.flatten().fieldErrors), { status: 400 });
    }

    await connectDB()
    const job = await Job.create({
      ...validation.data,
      employerId: userId,
      posted: "Just now",
    })
    return NextResponse.json(job)
  } catch (error) {
    console.error("[JOBS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET() {
  await connectDB()
  const jobs = await Job.find()
  return NextResponse.json(jobs)
}