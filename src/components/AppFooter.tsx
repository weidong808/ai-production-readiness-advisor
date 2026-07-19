import Link from "next/link";
import { SiteHomeLink } from "@/components/SiteHomeLink";
import {
  ADVISORY_DISCLAIMER,
  APP_NAME,
  GITHUB_REPO_URL,
  RETIRECHECK_URL,
  ROADMAP_URL,
  SITE_SERIES_NAME,
  SLEEPCHECK_URL,
} from "@/lib/brand";

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs space-y-3">
            <p className="text-sm font-semibold">{APP_NAME}</p>
            <p className="text-sm text-[var(--ink-muted)]">
              Structured readiness scores with hard gates and an advisory
              narrative. Part of {SITE_SERIES_NAME}.
            </p>
            <SiteHomeLink
              variant="full"
              markSize={28}
              className="text-sm text-[var(--ink-muted)]"
            />
          </div>
          <nav
            className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-[var(--ink-muted)] sm:text-right"
            aria-label="Footer"
          >
            <Link href="/about" className="hover:text-[var(--ink)]">
              About
            </Link>
            <Link href="/sample" className="hover:text-[var(--ink)]">
              Sample report
            </Link>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--ink)]"
            >
              GitHub
            </a>
            <a
              href={ROADMAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--ink)]"
            >
              Series roadmap
            </a>
            <a
              href={RETIRECHECK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--ink)]"
            >
              RetireCheck
            </a>
            <a
              href={SLEEPCHECK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--ink)]"
            >
              SleepCheck
            </a>
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--line)] pt-5 text-xs text-[var(--ink-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>{ADVISORY_DISCLAIMER}</p>
          <p>
            © {year} {APP_NAME} · {SITE_SERIES_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
