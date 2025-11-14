import { NextRequest, NextResponse } from "next/server";
import { saveFile, getAllFiles, cleanExpiredFiles } from "@/lib/fileStorage";

// GET - 파일 목록 조회
export async function GET() {
  try {
    // 만료된 파일 자동 삭제
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

// POST - 파일 업로드
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

    const buffer = Buffer.from(await file.arrayBuffer());
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
