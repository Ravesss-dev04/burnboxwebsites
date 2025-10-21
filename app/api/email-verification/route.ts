import { generateOTP, otpStore } from '@/utils/otpStore';
import { sendOtpEmail } from '@/utils/mailer'; // Import the updated sendOtpEmail function
import { corsHeaders } from '@/lib/corsHeaders';


export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}


export async function POST(req: Request) {
  const { name, contact, email } = await req.json();

  const otp = generateOTP(); // Generate OTP
  const expires = Date.now() + Number(process.env.OTP_EXPIRES_MINUTES || 5) * 60000; // OTP expiry time

  otpStore.set(email, { otp, expires }); // Store OTP with expiration time

  // Send OTP email using the updated sendOtpEmail function
  const otpResult = await sendOtpEmail(email, name, otp);

  // If OTP email is sent successfully, return a success response
  if (otpResult.success) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ success: false, message: otpResult.message }), { status: 500 });
  }
}
