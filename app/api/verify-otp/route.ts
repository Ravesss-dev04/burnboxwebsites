import { corsHeaders } from "@/lib/corsHeaders";
import { otpStore } from "@/utils/otpStore";


export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}


export async function POST(req: Request) {
  const { email, otp } = await req.json();
  const stored = otpStore.get(email);
  if (!stored) return Response.json({ success: false, message: 'No OTP found' }, { status: 400 });
  if (stored.otp !== otp) return Response.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
  if (Date.now() > stored.expires) return Response.json({ success: false, message: 'OTP Expired' }, { status: 400 });
  otpStore.delete(email);

  return Response.json({ success: true });
}


