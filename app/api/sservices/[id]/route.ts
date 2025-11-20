import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// UPDATE service
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Add Promise here
) {
  try {
    const { name, price, imageUrl, description } = await req.json();
    const { id } = await params; // Await the params
    
    const updatedService = await prisma.service.update({
      where: { id: parseInt(id) }, // Use the awaited id
      data: {
        name,
        price: parseFloat(price),
        imageUrl,
        description: description || ""
      }
    });
    
    return NextResponse.json(updatedService);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}


// DELETE service
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Add Promise here
) {
  try {
    const { id } = await params; // Await the params
    
    await prisma.service.delete({
      where: { id: parseInt(id) } // Use the awaited id
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}