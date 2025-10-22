// app/api/verify-otp/route.ts
import { NextResponse } from "next/server";
import { otpStore } from "@/lib/otp-store";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ 
        success: false, 
        message: "Email and OTP are required" 
      }, { status: 400 });
    }

    if (otpStore.isValid(email, otp)) {
      otpStore.delete(email);
      return NextResponse.json({ 
        success: true, 
        message: "OTP verified successfully" 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Verification failed" 
    }, { status: 500 });
  }
}