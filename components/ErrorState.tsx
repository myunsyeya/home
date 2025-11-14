import Link from "next/link";

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-4">
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
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-foreground">{message}</h2>
        <Link
          href="/share"
          className="mt-4 px-6 py-3 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          Go to File Share
        </Link>
      </div>
    </div>
  );
}
