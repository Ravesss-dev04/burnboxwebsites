// app/api/send-otp/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { otpStore } from "@/lib/otp-store";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 10-minute expiration
    otpStore.set(email, otp, 10 * 60 * 1000);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Your Company Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px;
                }
                .header { 
                    background: #f8f9fa; 
                    padding: 20px; 
                    border-radius: 8px; 
                    margin-bottom: 20px;
                    text-align: center;
                }
                .otp-code { 
                    font-size: 32px; 
                    font-weight: bold; 
                    text-align: center; 
                    color: #007bff; 
                    margin: 20px 0;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    letter-spacing: 5px;
                }
                .note { 
                    background: #fff3cd; 
                    border: 1px solid #ffeaa7; 
                    border-radius: 5px; 
                    padding: 15px; 
                    margin: 15px 0;
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 style="margin: 0; color: #333;">Verification Code</h1>
                <p style="margin: 5px 0 0 0; color: #666;">Use this code to verify your email</p>
            </div>
            
            <p>Hello,</p>
            <p>Please use the following verification code to complete your inquiry:</p>
            
            <div class="otp-code">${otp}</div>
            
            <div class="note">
                <p><strong>Note:</strong></p>
                <ul>
                    <li>This code will expire in 5 minutes</li>
                </ul>
            </div>
            
            <p>Best regards,<br>${email}</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="text-align: center; color: #666; font-size: 12px;">
                This is an automated message. Please do not reply to this email.
            </p>
        </body>
        </html>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`OTP sent to ${email}: ${otp}`); // Keep for debugging

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully to your email" 
    });

  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ 
      error: "Failed to send OTP. Please try again." 
    }, { status: 500 });
  }
}