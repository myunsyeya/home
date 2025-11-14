import { NextRequest, NextResponse } from "next/server";
import { updateFilePermanent } from "@/lib/fileStorage";

// PATCH - 파일 영구 여부 업데이트
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { permanent } = body;

    if (typeof permanent !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid permanent value" },
        { status: 400 }
      );
    }

    const updatedFile = await updateFilePermanent(id, permanent);

    if (!updatedFile) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, file: updatedFile });
  } catch (error) {
    console.error("Failed to update file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update file" },
      { status: 500 }
    );
  }
}
