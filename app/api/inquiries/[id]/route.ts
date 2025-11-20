import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single inquiry
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const inquiry = await (prisma as any).inquiry.findUnique({
      where: { id }
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(inquiry);
  } catch (error: any) {
    console.error("Error fetching inquiry:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiry" },
      { status: 500 }
    );
  }
}

// DELETE inquiry
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Check if inquiry exists first
    const inquiry = await (prisma as any).inquiry.findUnique({
      where: { id }
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    await (prisma as any).inquiry.delete({
      where: { id }
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Inquiry deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}

// UPDATE inquiry status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { status } = await req.json();
    
    // Validate status
    const validStatuses = ["New", "Contacted", "Completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Check if inquiry exists
    const existingInquiry = await (prisma as any).inquiry.findUnique({
      where: { id }
    });

    if (!existingInquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    // Update the inquiry
    const inquiry = await (prisma as any).inquiry.update({
      where: { id },
      data: { status }
    });
    
    return NextResponse.json({ 
      success: true,
      inquiry 
    });
  } catch (error: any) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}