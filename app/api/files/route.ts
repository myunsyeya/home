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
      const filePromises: Promise<FileMetadata>[] = [];

      bb.on("field", (name, value) => {
        if (name === "permanent") {
          permanent = value === "true";
        }
      });

      bb.on("file", (name, file, info) => {
        const { filename, mimeType } = info;
        const id = generateFileId();
        const filePath = getFilePath(id, filename);
        let fileSize = 0;

        // Create a promise for this file's processing
        const filePromise = new Promise<FileMetadata>((resolveFile, rejectFile) => {
          const writeStream = fs.createWriteStream(filePath);

          // Track file size
          file.on("data", (chunk) => {
            fileSize += chunk.length;
          });

          file.on("error", (error) => {
            console.error("File stream error:", error);
            rejectFile(error);
          });

          writeStream.on("error", (error) => {
            console.error("Write stream error:", error);
            rejectFile(error);
          });

          writeStream.on("finish", async () => {
            try {
              // Create metadata after file is fully written
              const metadata: FileMetadata = {
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
              files.push(metadata);
              await writeMetadata(files);

              resolveFile(metadata);
            } catch (error) {
              rejectFile(error);
            }
          });

          // Pipe file to disk
          file.pipe(writeStream);
        });

        filePromises.push(filePromise);
      });

      bb.on("close", async () => {
        try {
          // Wait for all files to finish processing
          if (filePromises.length === 0) {
            resolve(
              NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
              )
            );
            return;
          }

          const uploadedFiles = await Promise.all(filePromises);
          const fileMetadata = uploadedFiles[0]; // Return first file

          resolve(NextResponse.json({ success: true, file: fileMetadata }));
        } catch (error) {
          console.error("Failed to process files:", error);
          resolve(
            NextResponse.json(
              { success: false, error: "Failed to process files" },
              { status: 500 }
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
