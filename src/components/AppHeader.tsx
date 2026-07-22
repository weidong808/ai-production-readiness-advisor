"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHomeLink } from "@/components/SiteHomeLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  APP_NAME,
  APP_SHORT_NAME,
  APP_TAGLINE,
  SITE_SERIES_NAME,
} from "@/lib/brand";

const NAV = [
  { href: "/assess", label: "Assess" },
  { href: "/sample", label: "Sample" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5"
          aria-label={`${APP_NAME} home`}
        >
          <Image
            src="/app-mark.svg"
            alt=""
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 shrink-0 rounded-lg border border-[var(--border)] transition-colors group-hover:border-[var(--accent)]/50"
          />
          <span className="min-w-0">
            <span
              className="block truncate text-lg leading-none text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)] sm:text-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="sm:hidden">{APP_SHORT_NAME}</span>
              <span className="hidden sm:inline">{APP_NAME}</span>
            </span>
            <span className="mt-1 block truncate font-mono text-[10px] tracking-[0.14em] text-[var(--muted)] uppercase">
              {SITE_SERIES_NAME} · {APP_TAGLINE}
            </span>
          </span>
        </Link>

        <nav
          className="flex shrink-0 items-center gap-1 text-sm sm:gap-2"
          aria-label="Primary"
        >
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-2.5 py-1.5 transition-colors ${
                  active
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <SiteHomeLink
            variant="compact"
            markSize={18}
            className="ml-1 text-[var(--muted)]"
          />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
