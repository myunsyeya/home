"use client";

import { useParams } from "next/navigation";
import { useSharedFile } from "@/hooks/useSharedFile";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import FileDisplay from "@/components/FileDisplay";

export default function SharedFilePage() {
  const params = useParams();
  const id = params?.id as string;
  const { file, loading, error } = useSharedFile(id);

  if (loading) return <LoadingState />;
  if (error || !file) return <ErrorState message={error || "File not found"} />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <FileDisplay file={file} />
    </div>
  );
}
