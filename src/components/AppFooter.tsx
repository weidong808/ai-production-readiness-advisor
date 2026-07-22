import Image from "next/image";
import Link from "next/link";
import { SiteHomeLink } from "@/components/SiteHomeLink";
import {
  ADVISORY_DISCLAIMER,
  APP_NAME,
  GITHUB_REPO_URL,
  RETIRECHECK_URL,
  ROADMAP_URL,
  SITE_BRAND_NAME,
  SITE_CASE_STUDY_LABEL,
  SITE_CASE_STUDY_URL,
  SITE_INSIGHT_LABEL,
  SITE_INSIGHT_URL,
  SITE_SERIES_NAME,
  SLEEPCHECK_URL,
} from "@/lib/brand";

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print mt-12 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)]">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Image
                src="/app-mark.svg"
                alt=""
                width={28}
                height={28}
                unoptimized
                className="h-7 w-7 rounded-md border border-[var(--border)]"
              />
              <span
                className="text-lg text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {APP_NAME}
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed">
              Structured readiness scores with hard gates and an advisory
              narrative. Advisory only — not certification. Part of{" "}
              {SITE_SERIES_NAME}.
            </p>
            <div className="mt-4">
              <SiteHomeLink
                variant="full"
                markSize={28}
                className="text-[var(--foreground)]"
              />
            </div>
          </div>

          <div className="flex gap-12 text-xs">
            <div>
              <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
                App
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="transition-colors hover:text-[var(--foreground)]"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="transition-colors hover:text-[var(--foreground)]"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sample"
                    className="transition-colors hover:text-[var(--foreground)]"
                  >
                    Sample report
                  </Link>
                </li>
                <li>
                  <a
                    href={SITE_CASE_STUDY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[var(--foreground)]"
                  >
                    {SITE_CASE_STUDY_LABEL}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE_INSIGHT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[var(--foreground)]"
                  >
                    {SITE_INSIGHT_LABEL}
                  </a>
                </li>
                <li>
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[var(--foreground)]"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
                Series
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href={ROADMAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[var(--foreground)]"
                  >
                    Series roadmap
                  </a>
                </li>
                <li>
                  <a
                    href={RETIRECHECK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[var(--foreground)]"
                  >
                    RetireCheck
                  </a>
                </li>
                <li>
                  <a
                    href={SLEEPCHECK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[var(--foreground)]"
                  >
                    SleepCheck
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--border)] pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>{ADVISORY_DISCLAIMER}</p>
          <p className="font-mono tracking-wide uppercase">
            © {year} {SITE_BRAND_NAME} · {SITE_SERIES_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
