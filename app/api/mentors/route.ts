import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Mentor } from '@/models/mentor'

export async function GET() {
  try {
    await connectDB()
    const mentors = await Mentor.find()
    return NextResponse.json(mentors)
  } catch (error) {
    console.error("Error fetching mentors:", error)
    return NextResponse.json({ error: "Failed to fetch mentors" }, { status: 500 })
  }
}
