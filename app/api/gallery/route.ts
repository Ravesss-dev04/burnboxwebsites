import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET all gallery items
export async function GET() {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Fetch gallery error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// ✅ POST: save uploaded image URLs from GitHub upload route
export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json(); // Expecting { urls: ["https://raw.githubusercontent.com/..."] }

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "No image URLs provided" }, { status: 400 });
    }

    const createdImages = [];

    for (const url of urls) {
      const fileName = url.split("/").pop() || "untitled";
      const title = fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (char: string) => char.toUpperCase());

      const newImage = await prisma.gallery.create({
        data: {
          imageUrl: url,
          title,
          altText: title,
        },
      });

      createdImages.push(newImage);
    }

    return NextResponse.json({
      success: true,
      message: "Images added to gallery successfully",
      data: createdImages,
    });
  } catch (error) {
    console.error("Create gallery error:", error);
    return NextResponse.json(
      { error: "Failed to add image to gallery" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
