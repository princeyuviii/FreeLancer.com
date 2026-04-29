// app/api/send-application/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email, jobTitle, company } = await request.json()

  try {
    const data = await resend.emails.send({
      from: 'noreply@yuviii.xyz',
      to: email,
      subject: `Application Confirmation - ${jobTitle} at ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Application Received!</h2>
          <p>Hello,</p>
          <p>You've successfully applied for <strong>${jobTitle}</strong> at <strong>${company}</strong>.</p>

          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h3 style="color: #4f46e5; margin-top: 0;">Application Details</h3>
            <p><strong>Status:</strong> Application Received</p>
            <p><strong>Next Steps:</strong> The hiring team will review your application and contact you within 3-5 business days.</p>
          </div>

          <p>Thank you for using our platform!</p>
          <p style="color: #6b7280; font-size: 14px;">This is an automated message - please do not reply directly.</p>
        </div>
      `
    })
    console.log("Resend Success:", data);
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ error }, { status: 500 })
  }
}
