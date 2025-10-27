import { corsHeaders } from "@/lib/corsHeaders";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(req: Request) {
    try {
        const {name, email, message, imageBase64, productName, productPrice} = await req.json();
        if(!name || !email || !message) {
            return NextResponse.json({error: "Missing required fields."}, {status: 400})
        }

        // create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
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
                </div>
                ` : '<p><em>No sample layout image provided.</em></p>'}
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <p style="text-align: center; color: #666; font-size: 12px;">
                    This inquiry was sent from your website contact form.
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
        return NextResponse.json({success: true, message: "Inquiry email sent successfully!"});

    } catch (err) {
        console.log("Email send failed:", err);
        return NextResponse.json({error: "Failed to send inquiry."}, {status: 500, headers: corsHeaders})
    }
}