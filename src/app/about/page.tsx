import type { Metadata } from "next";
import Link from "next/link";
import {
  ADVISORY_DISCLAIMER,
  APP_DESCRIPTION,
  APP_NAME,
  APP_SERIES_LABEL,
  APP_TAGLINE,
  GITHUB_REPO_URL,
  ROADMAP_URL,
  SITE_CASE_STUDY_LABEL,
  SITE_CASE_STUDY_URL,
  SITE_SERIES_NAME,
  SITE_SERIES_TAGLINE,
} from "@/lib/brand";

export const metadata: Metadata = {
  title: `About · ${APP_NAME}`,
  description: APP_DESCRIPTION,
};

export default function AboutPage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-5 py-8 sm:px-6 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
        {APP_SERIES_LABEL}
      </p>
      <h1
        className="mt-2 text-3xl tracking-tight text-[var(--foreground)] sm:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {APP_TAGLINE}
      </h1>

      <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--muted)]">
        <p className="text-[var(--foreground)]/90">{APP_DESCRIPTION}</p>
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
          <span className="text-[var(--foreground)]">Disclaimer:</span>{" "}
          {ADVISORY_DISCLAIMER} Use the report as a structured conversation
          starter with your engineering, security, and compliance teams — not
          as sign-off.
        </p>
        <p>
          Part of <span className="text-[var(--foreground)]">{SITE_SERIES_NAME}</span>{" "}
          — {SITE_SERIES_TAGLINE.toLowerCase()}. Built by Weidong Shi with
          Next.js, TypeScript, and Tailwind CSS; deployed on Vercel.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/assess"
          className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] transition hover:brightness-110"
        >
          Start assessment
        </Link>
        <Link
          href="/sample"
          className="rounded-md border border-[var(--border)] px-5 py-2.5 text-sm hover:bg-[var(--card)]"
        >
          View sample report
        </Link>
        <a
          href={SITE_CASE_STUDY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-[var(--border)] px-5 py-2.5 text-sm hover:bg-[var(--card)]"
        >
          {SITE_CASE_STUDY_LABEL} ↗
        </a>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-[var(--border)] px-5 py-2.5 text-sm hover:bg-[var(--card)]"
        >
          Source on GitHub ↗
        </a>
        <a
          href={ROADMAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-[var(--border)] px-5 py-2.5 text-sm hover:bg-[var(--card)]"
        >
          Series roadmap ↗
        </a>
      </div>
    </main>
  );
}
