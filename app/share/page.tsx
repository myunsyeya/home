"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import { useFileShare } from "@/hooks/useFileShare";
import UploadZone from "@/components/UploadZone";
import FileItem from "@/components/FileItem";
import Toast from "@/components/Toast";

export default function SharePage() {
  const {
    files,
    uploading,
    isProcessing,
    uploadFiles,
    deleteFile,
    togglePermanent,
    copyShareLink,
    copyEmbedLink,
    copiedId,
    embedCopiedId,
  } = useFileShare();

  const [isDragging, setIsDragging] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) await uploadFiles(e.dataTransfer.files);
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await uploadFiles(e.target.files);
  };

  const handleCopyLink = (id: string) => {
    copyShareLink(id);
    setToastMessage("Share link copied to clipboard");
    setShowToast(true);
  };

  const handleCopyEmbedLink = (id: string) => {
    copyEmbedLink(id);
    setToastMessage("Embed link copied to clipboard");
    setShowToast(true);
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 dark:bg-black pt-20 px-4">
      <main className="w-full max-w-4xl flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            File Share
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
            Upload files via drag & drop and share with links
          </p>
        </div>

        <UploadZone
          uploading={uploading}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
        />

        <div className="flex flex-col gap-3">
          {files.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              No files uploaded yet
            </div>
          ) : (
            files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                processing={isProcessing(file.id)}
                copied={copiedId === file.id}
                embedCopied={embedCopiedId === file.id}
                onTogglePermanent={() =>
                  togglePermanent(file.id, file.permanent)
                }
                onCopyLink={() => handleCopyLink(file.id)}
                onCopyEmbedLink={() => handleCopyEmbedLink(file.id)}
                onDelete={() => deleteFile(file.id)}
              />
            ))
          )}
        </div>
      </main>

      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}
