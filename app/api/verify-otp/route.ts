import { NextResponse } from "next/server";
import { otpStore } from "../send-otp/route";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const record = otpStore.get(email);

    if (!record) {
      return NextResponse.json({ success: false, message: "No OTP found" }, { status: 400 });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return NextResponse.json({ success: false, message: "OTP expired" }, { status: 400 });
    }



    
    if (record.otp !== otp) {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    // OTP valid
    otpStore.delete(email);
    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}


