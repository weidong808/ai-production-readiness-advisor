import Link from "next/link";
import { LandingPreview } from "@/components/LandingPreview";
import {
  APP_NAME,
  APP_SERIES_LABEL,
  APP_TAGLINE,
  APP_TRUST_LINE,
  SITE_CASE_STUDY_LABEL,
  SITE_CASE_STUDY_URL,
  SITE_INSIGHT_LABEL,
  SITE_INSIGHT_URL,
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
        <p className="ra-rise font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
          {APP_SERIES_LABEL}
        </p>
        <h1
          className="ra-rise-delay mt-2 text-3xl leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {APP_NAME}
        </h1>
        <p className="ra-rise-delay mt-2 max-w-xl text-lg leading-snug text-[var(--foreground)]/90 sm:text-xl">
          {APP_TAGLINE}
        </p>
        <p className="ra-rise-delay-2 mt-3 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Eight dimensions, deterministic scores, and hard gates the model
          can&apos;t talk its way past. Advisory only, not a certification.
        </p>
        <p className="ra-rise-delay-2 mt-2 max-w-xl text-sm text-[var(--muted)]">
          {APP_TRUST_LINE}
        </p>
        <div className="ra-rise-delay-2 mt-6 flex flex-wrap items-center gap-3">
          <Link id="main-cta" href="/assess" className="ui-btn ui-btn-primary px-5 py-2.5">
            Start assessment
          </Link>
          <Link href="/sample" className="ui-btn ui-btn-secondary px-5 py-2.5">
            View sample report
          </Link>
        </div>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
          <a
            href={SITE_CASE_STUDY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {SITE_CASE_STUDY_LABEL}
          </a>
          <a
            href={SITE_INSIGHT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {SITE_INSIGHT_LABEL}
          </a>
        </p>

        <section className="mt-10 border-t border-[var(--border)] pt-8">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            How it works
          </h2>
          <p className="mt-1.5 text-sm text-[var(--muted)]">
            Three steps from context to an actionable readiness report.
          </p>
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

        <section className="mt-10 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                What you get
              </h2>
              <p className="mt-1.5 text-sm text-[var(--muted)]">
                Band, hard gates, dimension scores, risks, and remediation.
              </p>
            </div>
            <Link
              href="/sample"
              className="text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Open full sample →
            </Link>
          </div>
          <LandingPreview />
        </section>

        <p className="mt-8 text-center text-xs text-[var(--muted)] sm:text-sm">
          Deterministic scoring · answers stay in your browser · advisory, not
          certification
        </p>
      </div>
    </main>
  );
}
