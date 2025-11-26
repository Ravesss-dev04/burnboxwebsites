import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { corsHeaders } from "@/lib/corsHeaders";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, imageBase64, productName, productPrice } = await req.json();
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields." }, 
        { status: 400, headers: corsHeaders }
      );
    }

    let imageUrl = null;

    // Get the base URL from request headers to avoid Hostinger 404 issue
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('host') || req.headers.get('x-forwarded-host') || 'burnboxadvertising.com';
    const baseUrl = `${protocol}://${host}`;

    // Upload image to GitHub if provided
    if (imageBase64) {
      try {
        const uploadResponse = await fetch(`${baseUrl}/api/uploadimages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: [{
              name: `inquiry-${Date.now()}.png`,
              content: imageBase64.split(',')[1] // Remove data URL prefix
            }]
          }),
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          imageUrl = uploadResult.urls[0];
        } else {
          console.error("Image upload failed:", uploadResult);
        }
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        // Continue without image URL if upload fails
      }
    }

    // Save inquiry to database
    // Use an any-cast to bypass missing generated model typings (ensure your Prisma schema defines the model and run `prisma generate`)
    const inquiry = await (prisma as any).inquiry.create({
      data: {
        name,
        email,
        product: productName,
        price: productPrice,
        message,
        imageUrl,
        status: "New"
      }
    });

    // Send email notification to business (your existing email logic)
    await sendEmailNotification({ name, email, message, imageBase64, productName, productPrice, imageUrl });

    // Send thank you email to user with feedback request
    await sendThankYouEmail({ name, email, productName, baseUrl });

    return NextResponse.json({ 
      success: true, 
      message: "Inquiry submitted successfully!",
      inquiry 
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("Error in send-inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Your existing email function, slightly modified
async function sendEmailNotification({ 
  name, 
  email, 
  message, 
  imageBase64, 
  productName, 
  productPrice, 
  imageUrl 
}: {
  name: string;
  email: string;
  message: string;
  imageBase64?: string;
  productName: string;
  productPrice: string;
  imageUrl?: string | null;
}) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare attachments array
    const attachments = [];
    let imageType = 'png'; 
    
    if (imageBase64) {
      // Extract base64 data and image type
      const matches = imageBase64.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        imageType = matches[1]; // png, jpg, etc.
        const base64Data = matches[2]; // actual base64 data
        
        // Create TWO attachments - one for display, one for download
        attachments.push({
          filename: `sample-layout.${imageType}`,
          content: base64Data,
          encoding: 'base64',
          contentType: `image/${imageType}`,
          cid: 'sampleLayout' // Content ID for embedding
        });
        
        // Second attachment with different CID for download
        attachments.push({
          filename: `sample-layout.${imageType}`,
          content: base64Data,
          encoding: 'base64',
          contentType: `image/${imageType}`,
          cid: 'downloadLayout' // Different CID for download
        });
      }
    }

    // HTML with embedded image and working download link
    const htmlBody = `
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
              .field { 
                  margin-bottom: 15px; 
                  padding: 10px;
                  border-left: 4px solid #007bff;
                  background: #f8f9fa;
              }
              .label { 
                  font-weight: bold; 
                  color: #555; 
                  display: block;
                  margin-bottom: 5px;
              }
              .message { 
                  background: #f8f9fa; 
                  padding: 15px; 
                  border-radius: 5px; 
                  margin: 15px 0;
                  border-left: 4px solid #28a745;
              }
              .image-section { 
                  margin: 20px 0; 
                  padding: 15px;
                  background: #e7f3ff;
                  border-radius: 8px;
              }
              .image-container { 
                  text-align: center; 
                  margin: 15px 0; 
              }
              .download-link { 
                  display: inline-block; 
                  background: #007bff; 
                  color: white; 
                  padding: 10px 15px; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  margin-top: 10px;
                  font-weight: bold;
              }
              img { 
                  max-width: 100%; 
                  height: auto; 
                  border: 1px solid #ddd; 
                  border-radius: 5px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .database-info {
                  background: #d4edda;
                  border: 1px solid #c3e6cb;
                  border-radius: 5px;
                  padding: 10px;
                  margin: 10px 0;
                  font-size: 12px;
                  color: #155724;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1 style="margin: 0; color: #333;">New Product Inquiry</h1>
              <p style="margin: 5px 0 0 0; color: #666;">Product: ${productName} - Price: ${productPrice}</p>
          </div>
          
          
          
          <div class="field">
              <span class="label">Name:</span> 
              ${name}
          </div>
          
          <div class="field">
              <span class="label">Email:</span> 
              <a href="mailto:${email}">${email}</a>
          </div>
          
          <div class="field">
              <span class="label">Message:</span>
              <div class="message">${message.replace(/\n/g, '<br>')}</div>
          </div>
          
          ${imageBase64 ? `
          <div class="image-section">
              <h3 style="margin-top: 0;">Sample Layout Image</h3>
              <div class="image-container">
                  <img src="cid:sampleLayout" alt="Sample Layout" />
              </div>
              ${imageUrl ? `<p><small>Image also saved to: ${imageUrl}</small></p>` : ''}
          </div>
          ` : '<p><em>No sample layout image provided.</em></p>'}
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="text-align: center; color: #666; font-size: 12px;">
              This inquiry was sent from your website contact form and saved to the database.
          </p>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Product Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.BUSINESS_EMAIL,
      subject: `New ${productName} Inquiry from ${name}`,
      html: htmlBody,
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);
    console.log("Inquiry email sent successfully");

  } catch (emailError) {
    console.error("Failed to send inquiry email:", emailError);
    // Don't throw error - we still want to save the inquiry to database
  }
}

// Send thank you email to user with feedback request
async function sendThankYouEmail({ 
  name, 
  email, 
  productName,
  baseUrl 
}: {
  name: string;
  email: string;
  productName: string;
  baseUrl: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Generate feedback link using the correct base URL
    const feedbackLink = `${baseUrl}/feedback?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;

    const htmlBody = `
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
                  background-color: #f9f9f9;
              }
              .container {
                  background: white;
                  border-radius: 10px;
                  padding: 30px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header { 
                  background: linear-gradient(135deg, #F43C6D, #ff6b6b); 
                  padding: 30px; 
                  border-radius: 8px; 
                  margin-bottom: 20px;
                  text-align: center;
                  color: white;
              }
              .header h1 {
                  margin: 0;
                  font-size: 28px;
              }
              .content {
                  padding: 20px 0;
              }
              .feedback-section {
                  background: #f8f9fa;
                  padding: 25px;
                  border-radius: 8px;
                  margin: 25px 0;
                  border-left: 4px solid #F43C6D;
              }
              .feedback-button {
                  display: inline-block;
                  background: linear-gradient(135deg, #F43C6D, #ff6b6b);
                  color: white;
                  padding: 15px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
                  font-weight: bold;
                  text-align: center;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .feedback-button:hover {
                  background: linear-gradient(135deg, #e02d5a, #e55a5a);
              }
              .footer {
                  text-align: center;
                  color: #666;
                  font-size: 12px;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #ddd;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Thank You for Your Inquiry!</h1>
              </div>
              
              <div class="content">
                  <p>Dear ${name},</p>
                  
                  <p>Thank you for inquiring about <strong>${productName}</strong> with Burnbox Printing! We truly appreciate your interest in our services.</p>
                  
                  <p>Our team has received your inquiry and will review it shortly. We'll get back to you as soon as possible to discuss your requirements and provide you with the best solution.</p>
                  
                  <div class="feedback-section">
                      <h2 style="color: #F43C6D; margin-top: 0;">Help Us Improve!</h2>
                      <p>Your feedback is invaluable to us! We're constantly working to improve our services and customer experience. Would you mind taking a moment to share your thoughts?</p>
                      <p style="margin-bottom: 0;">Your feedback helps us:</p>
                      <ul>
                          <li>Improve our products and services</li>
                          <li>Enhance customer experience</li>
                          <li>Better understand your needs</li>
                      </ul>
                      
                      <div style="text-align: center; margin-top: 25px;">
                          <a href="${feedbackLink}" class="feedback-button">Leave Your Feedback</a>
                      </div>
                      
                      <p style="font-size: 12px; color: #666; margin-top: 20px; margin-bottom: 0;">
                          Or copy and paste this link into your browser:<br>
                          <a href="${feedbackLink}" style="color: #F43C6D; word-break: break-all;">${feedbackLink}</a>
                      </p>
                  </div>
                  
                  <p>If you have any questions or need immediate assistance, please don't hesitate to contact us:</p>
                  <ul>
                      <li>Email: <a href="mailto:burnboxprinting@gmail.com">burnboxprinting@gmail.com</a></li>
                      <li>Phone: <a href="tel:+639177008364">+63 917 700 8364</a></li>
                  </ul>
                  
                  <p>We look forward to serving you!</p>
                  
                  <p>Best regards,<br>
                  <strong>The Burnbox Printing Team</strong></p>
              </div>
              
              <div class="footer">
                  <p>© ${new Date().getFullYear()} Burnbox Printing. All rights reserved.</p>
                  <p>This email was sent to ${email} because you submitted an inquiry on our website.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Burnbox Printing" <${process.env.BUSINESS_EMAIL || process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank You for Your Inquiry - ${productName}`,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Thank you email sent to ${email}`);

  } catch (emailError) {
    console.error("Failed to send thank you email:", emailError);
    // Don't throw error - inquiry was already saved
  }
}