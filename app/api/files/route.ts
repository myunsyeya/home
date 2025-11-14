import { NextRequest, NextResponse } from "next/server";
import { getAllFiles, cleanExpiredFiles, ensureUploadDir, getFilePath, generateFileId, generateShareLink, readMetadata, writeMetadata } from "@/lib/fileStorage";
import type { FileMetadata } from "@/lib/fileStorage";
import busboy from "busboy";
import { Readable } from "node:stream";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";

export const runtime = "nodejs";
export const maxDuration = 300;

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

// POST - File upload (streaming)
export async function POST(request: NextRequest) {
  return new Promise<NextResponse>(async (resolve, reject) => {
    try {
      await ensureUploadDir();

      const headers = Object.fromEntries(request.headers);
      const bb = busboy({ headers });

      let permanent = false;
      let fileMetadata: FileMetadata | null = null;
      let fileSize = 0;

      bb.on("field", (name, value) => {
        if (name === "permanent") {
          permanent = value === "true";
        }
      });

      bb.on("file", async (name, file, info) => {
        const { filename, mimeType } = info;
        const id = generateFileId();
        const filePath = getFilePath(id, filename);

        try {
          // Stream file directly to disk
          const writeStream = fs.createWriteStream(filePath);

          // Track file size
          file.on("data", (chunk) => {
            fileSize += chunk.length;
          });

          await pipeline(file, writeStream);

          // Create metadata
          fileMetadata = {
            id,
            filename,
            originalName: filename,
            size: fileSize,
            mimeType,
            uploadedAt: Date.now(),
            permanent,
            shareLink: generateShareLink(id),
          };

          // Save metadata
          const files = await readMetadata();
          files.push(fileMetadata);
          await writeMetadata(files);
        } catch (error) {
          console.error("Failed to stream file:", error);
          reject(error);
        }
      });

      bb.on("close", () => {
        if (fileMetadata) {
          resolve(NextResponse.json({ success: true, file: fileMetadata }));
        } else {
          resolve(
            NextResponse.json(
              { success: false, error: "No file provided" },
              { status: 400 }
            )
          );
        }
      });

      bb.on("error", (error) => {
        console.error("Busboy error:", error);
        reject(error);
      });

      // Convert Web API stream to Node.js stream
      const nodeStream = Readable.fromWeb(request.body as any);
      nodeStream.pipe(bb);
    } catch (error) {
      console.error("Failed to upload file:", error);
      resolve(
        NextResponse.json(
          { success: false, error: "Failed to upload file" },
          { status: 500 }
        )
      );
    }
  });
}
