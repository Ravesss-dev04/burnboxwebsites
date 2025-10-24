import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all gallery images
export async function GET() {
  try {
    const gallery = await (prisma as any).gallery.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Fetch gallery error:", error);
    return NextResponse.json(
      { error:`Failed to fetch Error, ${error}`},
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST new gallery image
export async function POST(req: NextRequest) {
  try {
    const { imageUrl, title, altText } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }
    
    const newImage = await (prisma as any).gallery.create({
      data: {
        imageUrl,
        title: title || "",
        altText: altText || ""
      }
    });
    
    return NextResponse.json(newImage);
  }  catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Gallery fetch error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    console.error("Unknown gallery error:", error);
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
  } finally {
    await prisma.$disconnect();
  }
}