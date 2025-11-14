import Link from "next/link";
import { FileMetadata } from "@/lib/fileStorage";

interface FileDisplayProps {
  file: FileMetadata;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("ko-KR");
}

export default function FileDisplay({ file }: FileDisplayProps) {
  return (
    <div className="w-full max-w-2xl flex flex-col gap-8 py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {file.originalName}
        </h1>

        <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
          <span>{formatFileSize(file.size)}</span>
          <span>•</span>
          <span>{formatDate(file.uploadedAt)}</span>
          {file.permanent && (
            <>
              <span>•</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                Permanent
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={`/api/files/${file.id}`}
          download
          className="flex h-14 items-center justify-center gap-3 rounded-full bg-foreground px-8 text-lg font-medium text-background transition-all hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download
        </a>

        <Link
          href="/share"
          className="text-center py-3 text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors"
        >
          View more files
        </Link>
      </div>
    </div>
  );
}
