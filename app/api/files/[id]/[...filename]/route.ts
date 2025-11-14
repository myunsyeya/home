import { NextRequest, NextResponse } from "next/server";
import { getFile, getFilePath } from "@/lib/fileStorage";
import fs from "fs/promises";

// GET - Embed file (inline display with extension in URL)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; filename: string[] }> }
) {
  try {
    const { id } = await params;
    const file = await getFile(id);

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    const filePath = getFilePath(file.id, file.filename);
    const buffer = await fs.readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `inline; filename="${file.originalName}"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Failed to embed file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to embed file" },
      { status: 500 }
    );
  }
}
