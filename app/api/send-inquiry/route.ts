import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });


        // HTML 
        const htmlBody = `
            <h1 style="text-center font-size: 20px;">New Product Inquiry</h1>
            <p><b>Product: </b>${productName}</p>
            <p><b>Price: </b>${productPrice}</p>
            <p><b>Name: </b>${name}</p>
            <p><b>Email: </b>${email}</p>
            <p><b>Message: </b>${message}</p>
            ${
                imageBase64 ? `<p><b>Attached Sample Layout:</b></p><img src="${imageBase64}" alt="Sample layout" width="400" />`
                : ""
            }
        `;




        
        const mailOptions = {
            from: `"Product Inquiry" <${process.env.EMAIL_USER}>`,
            to: process.env.BUSINESS_EMAIL,
            subject: `New Inquiry from ${name}`,
            html: htmlBody,
        };
        


        await transporter.sendMail(mailOptions);
        return NextResponse.json({success: true, message: "Inquiry email sent successfully!"});

    } catch (err) {
        console.log("Email send failed:", err);
        return NextResponse.json({error: "Failed to send inquiry."}, {status: 500})
    }
}