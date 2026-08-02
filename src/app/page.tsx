import Link from "next/link";
import { LandingPreview } from "@/components/LandingPreview";
import { SeriesAppsStrip } from "@/components/SeriesAppsStrip";
import {
  ADVISORY_DISCLAIMER,
  APP_BENEFIT_LINE,
  APP_HUMAN_HEADLINE,
  APP_NAME,
  APP_PRIMARY_CTA_LABEL,
  APP_SERIES_LABEL,
  APP_STORY_CTA_LABEL,
  APP_TRUST_LINE,
  SITE_CASE_STUDY_URL,
} from "@/lib/brand";

const STEPS = [
  {
    title: "Describe your system",
    detail: "Context and risk profile — about 2 minutes.",
  },
  {
    title: "Answer 8 dimensions",
    detail:
      "Use-case & risk fit, data & privacy, evaluation, security, reliability, observability, oversight, and cost.",
  },
  {
    title: "Get band, gates, risks, remediation",
    detail:
      "Deterministic scores and hard gates — plus an OpenAI advisory narrative.",
  },
] as const;

export default function HomePage() {
  return (
    <main id="main" className="relative">
      <div className="mx-auto max-w-5xl px-5 pt-7 pb-10 sm:px-6 sm:pt-8 sm:pb-12">
        <section aria-labelledby="ra-entry-heading">
          <p className="ra-rise font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
            {APP_SERIES_LABEL}
          </p>
          <p
            className="ra-rise-delay mt-3 text-2xl leading-none tracking-tight text-[var(--foreground)] sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {APP_NAME}
          </p>
          <h1
            id="ra-entry-heading"
            className="ra-rise-delay mt-3 max-w-[22ch] text-[1.75rem] leading-[1.12] tracking-tight text-balance text-[var(--foreground)] sm:text-[2.35rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {APP_HUMAN_HEADLINE}
          </h1>
          <p className="ra-rise-delay-2 mt-3 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            {APP_BENEFIT_LINE}
          </p>
          <div className="ra-rise-delay-2 mt-6 flex flex-wrap items-center gap-3">
            <Link
              id="main-cta"
              href="/assess"
              className="ui-btn ui-btn-primary min-h-12 px-5 py-2.5"
            >
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
          </div>
          <p className="ra-rise-delay-2 mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            {APP_TRUST_LINE}
          </p>
          <p className="mt-2 max-w-xl rounded-md border border-[color-mix(in_srgb,var(--warn)_35%,transparent)] bg-[color-mix(in_srgb,var(--warn)_10%,transparent)] px-3 py-2 text-sm font-medium text-[var(--warn)]">
            {ADVISORY_DISCLAIMER}
          </p>

          <div className="ra-rise-delay-2 mt-8">
            <LandingPreview />
          </div>
        </section>

        <SeriesAppsStrip className="mt-8" />

        <section className="mt-10 border-t border-[var(--border)] pt-8">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                How it works
              </h2>
              <p className="mt-1.5 text-sm text-[var(--muted)]">
                Three steps from context to an actionable readiness report.
              </p>
            </div>
            <Link
              href="/sample"
              className="text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Open full sample →
            </Link>
          </div>
          <ol className="mt-5 grid gap-5 sm:grid-cols-3 sm:gap-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="space-y-1.5">
                <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
                  Step {i + 1}
                </p>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {step.title}
                </p>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-8 text-center text-xs text-[var(--muted)] sm:text-sm">
          Deterministic scoring · answers stay in your browser · advisory, not
          certification
        </p>
      </div>
    </main>
  );
}
