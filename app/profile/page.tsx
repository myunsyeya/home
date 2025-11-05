'use client';

import { useCallback, useMemo } from 'react';
import Image from 'next/image';

const GITHUB_USERNAME = 'myunsyeya';
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;
const STREAK_IMAGE_URL = `https://streak-stats.demolab.com?user=${GITHUB_USERNAME}`;

const openGitHub = (): void => {
  window.open(GITHUB_URL, '_blank', 'noopener,noreferrer');
};

const getButtonClassName = (): string =>
  'flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 font-medium text-background transition-all hover:scale-105 hover:shadow-lg active:scale-95';

export default function ProfilePage() {
  const handleGitHubClick = useCallback(() => openGitHub(), []);

  const streakImageProps = useMemo(
    () => ({
      src: STREAK_IMAGE_URL,
      alt: `${GITHUB_USERNAME} GitHub Streak`,
      width: 600,
      height: 200,
      unoptimized: true,
    }),
    []
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-10 px-6 py-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Profile
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            @{GITHUB_USERNAME}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-black/[.08] dark:border-white/[.145] shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">
            GitHub Streak
          </h2>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <Image {...streakImageProps} className="rounded-lg" />
          </a>

          <button onClick={handleGitHubClick} className={getButtonClassName()}>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Visit GitHub Profile
          </button>
        </div>
      </main>
    </div>
  );
}
