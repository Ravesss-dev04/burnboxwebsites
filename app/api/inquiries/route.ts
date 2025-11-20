import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all inquiries
export async function GET(req: NextRequest) {
  try {
    const inquiries = await (prisma as any).inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(inquiries);
  } catch (error: any) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

// POST new inquiry (optional - for manual creation)
export async function POST(req: NextRequest) {
  try {
    const { name, email, product, price, message, imageUrl } = await req.json();
    
    const inquiry = await (prisma as any).inquiry.create({
      data: {
        name,
        email,
        product,
        price,
        message,
        imageUrl,
        status: "New"
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      inquiry 
    });
  } catch (error: any) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to create inquiry" },
      { status: 500 }
    );
  }
}