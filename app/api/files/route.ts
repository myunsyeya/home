import { NextRequest, NextResponse } from "next/server";
import { saveFile, getAllFiles, cleanExpiredFiles } from "@/lib/fileStorage";

export const runtime = "nodejs";

// GET - File list
export async function GET() {
  try {
    // Clean up expired files
    await cleanExpiredFiles();

    const files = await getAllFiles();
    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error("Failed to get files:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get files" },
      { status: 500 }
    );
  }
}

// POST - File upload
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const permanent = formData.get("permanent") === "true";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert File to Buffer using arrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await saveFile(buffer, file.name, file.type, permanent);

    return NextResponse.json({ success: true, file: metadata });
  } catch (error) {
    console.error("Failed to upload file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
