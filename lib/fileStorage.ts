import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface FileMetadata {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: number;
  permanent: boolean;
  shareLink: string;
}

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const METADATA_FILE = path.join(UPLOAD_DIR, "metadata.json");
const ONE_HOUR = 60 * 60 * 1000;

// 업로드 디렉토리 초기화
export async function ensureUploadDir(): Promise<void> {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// 메타데이터 읽기
export async function readMetadata(): Promise<FileMetadata[]> {
  try {
    const data = await fs.readFile(METADATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 메타데이터 쓰기
export async function writeMetadata(files: FileMetadata[]): Promise<void> {
  await ensureUploadDir();
  await fs.writeFile(METADATA_FILE, JSON.stringify(files, null, 2));
}

// 파일 ID 생성
export function generateFileId(): string {
  return crypto.randomBytes(16).toString("hex");
}

// 공유 링크 생성
export function generateShareLink(id: string): string {
  return `/share/${id}`;
}

// 파일 경로 얻기
export function getFilePath(id: string, filename: string): string {
  return path.join(UPLOAD_DIR, `${id}-${filename}`);
}

// 만료된 파일 삭제
export async function cleanExpiredFiles(): Promise<number> {
  const files = await readMetadata();
  const now = Date.now();
  const expiredFiles = files.filter(
    (file) => !file.permanent && now - file.uploadedAt > ONE_HOUR
  );

  for (const file of expiredFiles) {
    try {
      const filePath = getFilePath(file.id, file.filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file ${file.id}:`, error);
    }
  }

  const remainingFiles = files.filter(
    (file) => file.permanent || now - file.uploadedAt <= ONE_HOUR
  );

  await writeMetadata(remainingFiles);
  return expiredFiles.length;
}

// 파일 저장
export async function saveFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  permanent: boolean
): Promise<FileMetadata> {
  await ensureUploadDir();

  const id = generateFileId();
  const filename = originalName;
  const filePath = getFilePath(id, filename);

  await fs.writeFile(filePath, buffer);

  const metadata: FileMetadata = {
    id,
    filename,
    originalName,
    size: buffer.length,
    mimeType,
    uploadedAt: Date.now(),
    permanent,
    shareLink: generateShareLink(id),
  };

  const files = await readMetadata();
  files.push(metadata);
  await writeMetadata(files);

  return metadata;
}

// 파일 삭제
export async function deleteFile(id: string): Promise<boolean> {
  const files = await readMetadata();
  const fileIndex = files.findIndex((f) => f.id === id);

  if (fileIndex === -1) {
    return false;
  }

  const file = files[fileIndex];
  const filePath = getFilePath(file.id, file.filename);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete file ${id}:`, error);
  }

  files.splice(fileIndex, 1);
  await writeMetadata(files);

  return true;
}

// 파일 가져오기
export async function getFile(id: string): Promise<FileMetadata | null> {
  const files = await readMetadata();
  return files.find((f) => f.id === id) || null;
}

// 모든 파일 가져오기
export async function getAllFiles(): Promise<FileMetadata[]> {
  return readMetadata();
}

// 파일 메타데이터 업데이트 (영구 여부 토글)
export async function updateFilePermanent(
  id: string,
  permanent: boolean
): Promise<FileMetadata | null> {
  const files = await readMetadata();
  const fileIndex = files.findIndex((f) => f.id === id);

  if (fileIndex === -1) {
    return null;
  }

  files[fileIndex].permanent = permanent;
  await writeMetadata(files);

  return files[fileIndex];
}
