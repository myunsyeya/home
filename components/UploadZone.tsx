"use client";

import { DragEvent, ChangeEvent } from "react";

interface UploadZoneProps {
  uploading: boolean;
  isDragging: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadZone({
  uploading,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: UploadZoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-2xl p-12 transition-all ${
        isDragging
          ? "border-foreground bg-zinc-100 dark:bg-zinc-900"
          : "border-zinc-300 dark:border-zinc-700"
      }`}
    >
      <input
        type="file"
        multiple
        onChange={onFileSelect}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex flex-col items-center gap-4 pointer-events-none">
        <svg
          className="w-16 h-16 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">
            {uploading ? "Uploading..." : "Drag files or click to upload"}
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            You can upload multiple files at once
          </p>
        </div>
      </div>
    </div>
  );
}
