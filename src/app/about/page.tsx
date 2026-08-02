import type { Metadata } from "next";
import Link from "next/link";
import { SeriesAppsStrip } from "@/components/SeriesAppsStrip";
import {
  ADVISORY_DISCLAIMER,
  APP_BENEFIT_LINE,
  APP_DESCRIPTION,
  APP_HUMAN_HEADLINE,
  APP_NAME,
  APP_PRIMARY_CTA_LABEL,
  APP_SERIES_LABEL,
  APP_STORY_CTA_LABEL,
  APP_TRUST_LINE,
  GITHUB_REPO_URL,
  LINKEDIN_ARTICLE_LABEL,
  LINKEDIN_ARTICLE_URL,
  ROADMAP_URL,
  SITE_CASE_STUDY_URL,
  SITE_INSIGHT_LABEL,
  SITE_INSIGHT_URL,
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
      <p
        className="mt-3 text-2xl leading-none tracking-tight text-[var(--foreground)] sm:text-3xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {APP_NAME}
      </p>
      <h1
        className="mt-3 text-3xl tracking-tight text-balance text-[var(--foreground)] sm:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {APP_HUMAN_HEADLINE}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
        {APP_BENEFIT_LINE}
      </p>
      <p className="mt-2 text-sm text-[var(--muted)]">{APP_TRUST_LINE}</p>
      <p className="mt-3 rounded-md border border-[color-mix(in_srgb,var(--warn)_35%,transparent)] bg-[color-mix(in_srgb,var(--warn)_10%,transparent)] px-3 py-2 text-sm font-medium text-[var(--warn)]">
        {ADVISORY_DISCLAIMER}
      </p>

      <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--muted)]">
        <p className="text-[var(--foreground)]/90">{APP_DESCRIPTION}</p>
        <p>
          The assessment walks through system context and eight readiness
          dimensions — use-case &amp; risk fit, data &amp; privacy, evaluation
          quality, security &amp; abuse, reliability &amp; ops, observability,
          human oversight, and cost &amp; performance. Scoring is deterministic
          with hard gates the model can&apos;t talk its way past; an
          OpenAI-generated narrative adds an executive summary, risks, and a
          remediation plan with citations from a curated reference corpus.
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
          as sign-off.{" "}
          <Link
            href="/privacy"
            className="text-[var(--accent)] underline-offset-2 hover:underline"
          >
            Privacy
          </Link>
          .
        </p>
        <p>
          Part of <span className="text-[var(--foreground)]">{SITE_SERIES_NAME}</span>{" "}
          — {SITE_SERIES_TAGLINE.toLowerCase()}. Methodology:{" "}
          <span className="text-[var(--foreground)]">
            Build → Validate → Improve → Document → Share
          </span>
          . Built by Weidong Shi with Next.js, TypeScript, and Tailwind CSS;
          deployed on Vercel.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/assess" className="ui-btn ui-btn-primary min-h-12 px-5 py-2.5">
          {APP_PRIMARY_CTA_LABEL}
        </Link>
        <a
          href={SITE_CASE_STUDY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ui-btn ui-btn-secondary min-h-12 px-5 py-2.5"
        >
          {APP_STORY_CTA_LABEL}
        </a>
        <Link
          href="/sample"
          className="ui-btn ui-btn-secondary min-h-12 px-5 py-2.5"
        >
          View sample report
        </Link>
        <a
          href={SITE_INSIGHT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ui-btn ui-btn-secondary min-h-12 px-5 py-2.5"
        >
          {SITE_INSIGHT_LABEL} ↗
        </a>
        {LINKEDIN_ARTICLE_URL ? (
          <a
            href={LINKEDIN_ARTICLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ui-btn ui-btn-secondary min-h-12 px-5 py-2.5"
          >
            {LINKEDIN_ARTICLE_LABEL} ↗
          </a>
        ) : null}
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ui-btn ui-btn-secondary min-h-12 px-5 py-2.5"
        >
          Source on GitHub ↗
        </a>
        <a
          href={ROADMAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ui-btn ui-btn-secondary min-h-12 px-5 py-2.5"
        >
          Series roadmap ↗
        </a>
      </div>

      <SeriesAppsStrip className="mt-8" />
    </main>
  );
}
