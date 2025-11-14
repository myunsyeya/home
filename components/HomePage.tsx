"use client";

import { useMemo } from "react";

const INITIALS = "myunsyeya";

const getLetterAnimation = (index: number): React.CSSProperties => ({
  animation: `float 3s ease-in-out ${index * 0.1}s infinite`,
  display: "inline-block",
});

const AnimatedLetter = ({ char, index }: { char: string; index: number }) => {
  const style = useMemo(() => getLetterAnimation(index), [index]);

  return (
    <span style={style} className="text-foreground">
      {char}
    </span>
  );
};

export default function HomePage() {
  const letters = useMemo(() => INITIALS.split(""), []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-12 px-6">
        <style jsx global>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-20px) rotate(2deg);
            }
            75% {
              transform: translateY(-10px) rotate(-2deg);
            }
          }
        `}</style>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
          {letters.map((char, index) => (
            <AnimatedLetter key={index} char={char} index={index} />
          ))}
        </h1>

        <p className="text-xl text-zinc-600 dark:text-zinc-400 text-center max-w-md">
          Welcome to my personal space
        </p>
      </main>
    </div>
  );
}
