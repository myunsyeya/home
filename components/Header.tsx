"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profile" },
  { href: "/tabby", label: "Tabby" },
  { href: "/share", label: "Share" },
] as const;

const isActiveLink = (pathname: string, href: string): boolean =>
  pathname === href;

const getLinkClassName = (isActive: boolean): string =>
  `px-4 py-2 rounded-lg transition-colors ${
    isActive
      ? "bg-foreground text-background"
      : "hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]"
  }`;

export default function Header() {
  const pathname = usePathname();

  const navLinks = useMemo(
    () =>
      NAV_ITEMS.map(({ href, label }) => ({
        href,
        label,
        isActive: isActiveLink(pathname, href),
      })),
    [pathname]
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/[.08] dark:border-white/[.145]">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <ul className="flex gap-2 justify-center">
          {navLinks.map(({ href, label, isActive }) => (
            <li key={href}>
              <Link href={href} className={getLinkClassName(isActive)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
