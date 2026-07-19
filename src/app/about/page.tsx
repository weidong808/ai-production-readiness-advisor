import type { Metadata } from "next";
import Link from "next/link";
import { SiteHomeLink } from "@/components/SiteHomeLink";
import {
  ADVISORY_DISCLAIMER,
  APP_DESCRIPTION,
  APP_NAME,
  APP_SERIES_LABEL,
  APP_TAGLINE,
  GITHUB_REPO_URL,
  ROADMAP_URL,
  SITE_SERIES_NAME,
  SITE_SERIES_TAGLINE,
} from "@/lib/brand";

export const metadata: Metadata = {
  title: `About · ${APP_NAME}`,
  description: APP_DESCRIPTION,
};

export default function AboutPage() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
        >
          ← Back to {APP_NAME}
        </Link>
        <SiteHomeLink
          variant="compact"
          markSize={18}
          className="text-sm text-[var(--ink-muted)]"
        />
      </div>

      <p className="mt-10 text-sm tracking-[0.2em] text-[var(--accent)] uppercase">
        {APP_SERIES_LABEL}
      </p>
      <h1
        className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {APP_TAGLINE}
      </h1>

      <div className="mt-8 space-y-5 text-base leading-relaxed text-[var(--ink-muted)]">
        <p className="text-[var(--ink)]/90">{APP_DESCRIPTION}</p>
        <p>
          The assessment walks through system context and eight readiness
          dimensions — use-case fit, data &amp; privacy, evaluation quality,
          safety guardrails, reliability, observability, cost controls, and
          governance. Scoring is deterministic; an OpenAI-generated narrative
          adds an executive summary, risks, and a remediation plan with
          citations from a curated reference corpus.
        </p>
        <p>
          Your answers stay in this browser. Answers are sent to the server
          only to generate the narrative, held briefly in a short-lived
          in-memory cache, never written to a database, and never used for
          model training.
        </p>
        <p>
          <span className="text-[var(--ink)]">Disclaimer:</span>{" "}
          {ADVISORY_DISCLAIMER} Use the report as a structured conversation
          starter with your engineering, security, and compliance teams — not
          as sign-off.
        </p>
        <p>
          Part of <span className="text-[var(--ink)]">{SITE_SERIES_NAME}</span>{" "}
          — {SITE_SERIES_TAGLINE.toLowerCase()}. Built by Weidong Shi with
          Next.js, TypeScript, and Tailwind CSS; deployed on Vercel.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/assess"
          className="rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#06120f] transition hover:bg-[var(--accent-strong)]"
        >
          Start assessment
        </Link>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-[var(--line)] px-5 py-3 text-sm hover:bg-[var(--bg-soft)]"
        >
          Source on GitHub ↗
        </a>
        <a
          href={ROADMAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-[var(--line)] px-5 py-3 text-sm hover:bg-[var(--bg-soft)]"
        >
          Series roadmap ↗
        </a>
      </div>
    </main>
  );
}
