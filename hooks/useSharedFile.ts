import { useState, useEffect } from "react";
import { FileMetadata } from "@/lib/fileStorage";

interface UseSharedFileReturn {
  file: FileMetadata | null;
  loading: boolean;
  error: string | null;
}

export function useSharedFile(id: string): UseSharedFileReturn {
  const [file, setFile] = useState<FileMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const response = await fetch("/api/files");
        const data = await response.json();

        if (!data.success) {
          setError("Failed to load file");
          return;
        }

        const foundFile = data.files.find((f: FileMetadata) => f.id === id);
        if (foundFile) {
          setFile(foundFile);
        } else {
          setError("File not found");
        }
      } catch {
        setError("Failed to load file");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadFile();
  }, [id]);

  return { file, loading, error };
}
