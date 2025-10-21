import { corsHeaders } from "@/lib/corsHeaders";
import { otpStore } from "@/utils/otpStore";


export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}


export async function POST(req: Request) {
  const { email, otp } = await req.json(); // Extract email and OTP from the request body

  const stored = otpStore.get(email); // Retrieve OTP from storage

  // If no OTP was stored for the email, return an error
  if (!stored) return Response.json({ success: false, message: 'No OTP found', }, { status: 400, headers: corsHeaders });

  // Check if the entered OTP matches the stored OTP
  if (stored.otp !== otp) return Response.json({ success: false, message: 'Invalid OTP' }, { status: 400, headers: corsHeaders });

  // Check if the OTP has expired
  if (Date.now() > stored.expires) return Response.json({ success: false, message: 'OTP Expired' }, { status: 400, headers: corsHeaders });

  otpStore.delete(email); // Remove the OTP from the store once it has been successfully verified
  // Return success if OTP is valid and not expired
  return Response.json(
    { success: true },
    {status: 200, headers: corsHeaders}
  );
}
