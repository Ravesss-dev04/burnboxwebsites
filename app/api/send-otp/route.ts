import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const otpStore = new Map(); // temporary (for production, use Redis or DB)

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP temporarily (valid for 5 minutes)
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // your App Password
      },
    });


    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Inquiry OTP Code",
      text: `Your verification code is: ${otp}\nIt will expire in 5 minutes.`,
    });

    return NextResponse.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ success: false, message: "Failed to send OTP" }, { status: 500 });
  }
}

export { otpStore };
