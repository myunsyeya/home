import { useState, useCallback, useEffect } from "react";
import { FileMetadata } from "@/lib/fileStorage";

interface UseFileShareReturn {
  files: FileMetadata[];
  uploading: boolean;
  processing: Record<string, boolean>;
  isProcessing: (id: string) => boolean;
  uploadFiles: (files: FileList) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  togglePermanent: (id: string, current: boolean) => Promise<void>;
  copyShareLink: (id: string) => void;
  copiedId: string | null;
}

export function useFileShare(): UseFileShareReturn {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    try {
      const response = await fetch("/api/files");
      const data = await response.json();
      if (data.success) setFiles(data.files);
    } catch (error) {
      console.error("Failed to load files:", error);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const setProcessingState = (id: string, state: boolean) => {
    setProcessing((prev) => ({ ...prev, [id]: state }));
  };

  const uploadFiles = async (fileList: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("permanent", "false");

        const response = await fetch("/api/files", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!data.success) {
          alert(`Upload failed: ${data.error}`);
        }
      }
      await loadFiles();
    } catch {
      alert("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    setProcessingState(id, true);
    try {
      const response = await fetch(`/api/files/${id}`, { method: "DELETE" });
      if (response.ok) {
        await loadFiles();
      } else {
        alert("Failed to delete file");
      }
    } catch {
      alert("An error occurred while deleting");
    } finally {
      setProcessingState(id, false);
    }
  };

  const togglePermanent = async (id: string, current: boolean) => {
    if (processing[id]) return;

    setProcessingState(id, true);
    try {
      const response = await fetch(`/api/files/${id}/permanent`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permanent: !current }),
      });

      if (response.ok) {
        await loadFiles();
      } else {
        alert("Failed to update status");
      }
    } catch {
      alert("An error occurred while updating");
    } finally {
      setProcessingState(id, false);
    }
  };

  const copyShareLink = (id: string) => {
    const link = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isProcessing = (id: string) => processing[id] || false;

  return {
    files,
    uploading,
    processing,
    isProcessing,
    uploadFiles,
    deleteFile,
    togglePermanent,
    copyShareLink,
    copiedId,
  };
}
