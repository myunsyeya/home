"use client";

import { useCallback } from "react";

const TABBY_URL = "http://myunsyeya.com:25565";

const openTabby = (): void => {
  window.open(TABBY_URL, "_blank", "noopener,noreferrer");
};

const getButtonClassName = (): string =>
  "flex h-14 items-center justify-center gap-3 rounded-full bg-foreground px-8 text-lg font-medium text-background transition-all hover:scale-105 hover:shadow-lg active:scale-95";

export default function TabbyPage() {
  const handleClick = useCallback(() => openTabby(), []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-8 px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Tabby Service
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
            Access the Tabby coding assistant running on port 25565
          </p>
        </div>

        <button onClick={handleClick} className={getButtonClassName()}>
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Open Tabby
        </button>

        <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
          Running at {TABBY_URL}
        </div>
      </main>
    </div>
  );
}
