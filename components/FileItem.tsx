"use client";

import { FileMetadata } from "@/lib/fileStorage";

interface FileItemProps {
  file: FileMetadata;
  processing: boolean;
  copied: boolean;
  onTogglePermanent: () => void;
  onCopyLink: () => void;
  onDelete: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

function formatTimeRemaining(uploadedAt: number): string {
  const remaining = 60 * 60 * 1000 - (Date.now() - uploadedAt);
  if (remaining <= 0) return "Expiring soon";

  const minutes = Math.floor(remaining / 60000);
  if (minutes < 1) return "Less than 1 min";
  if (minutes < 60) return `${minutes} min left`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m left`;
}

export default function FileItem({
  file,
  processing,
  copied,
  onTogglePermanent,
  onCopyLink,
  onDelete,
}: FileItemProps) {
  const handleCardClick = () => {
    if (!processing) {
      window.location.href = `/api/files/${file.id}`;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all ${
        processing
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate text-foreground">
            {file.originalName}
          </p>
          {file.permanent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Keep
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
          <span>{formatFileSize(file.size)}</span>
          {!file.permanent && (
            <span>{formatTimeRemaining(file.uploadedAt)}</span>
          )}
        </div>
      </div>

      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 영구 토글 */}
        <button
          onClick={onTogglePermanent}
          disabled={processing}
          className={`px-3 py-2 rounded-lg transition-colors ${
            processing
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
          title="Toggle permanent storage"
        >
          <div
            className={`relative w-10 h-5 rounded-full transition-colors ${
              file.permanent
                ? "bg-emerald-500 dark:bg-emerald-600"
                : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                file.permanent ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </button>

        {/* 공유 링크 복사 */}
        <button
          onClick={onCopyLink}
          disabled={processing}
          className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          title="Copy share link"
        >
          {copied ? (
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          )}
        </button>

        {/* 삭제 */}
        <button
          onClick={onDelete}
          disabled={processing}
          className="px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
          title="Delete"
        >
          <svg
            className="w-5 h-5 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
