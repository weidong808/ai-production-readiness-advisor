import Link from "next/link";
import { LandingPreview } from "@/components/LandingPreview";
import { APP_NAME, APP_SERIES_LABEL, APP_TAGLINE } from "@/lib/brand";

const STEPS = [
  {
    title: "Describe your system",
    detail: "Context and risk profile — about 2 minutes.",
  },
  {
    title: "Answer 8 dimensions",
    detail: "Ordinal A–D choices across use case, data, evals, safety, and more.",
  },
  {
    title: "Get band, gates, risks, remediation",
    detail: "Deterministic scores plus an advisory narrative with citations.",
  },
] as const;

export default function HomePage() {
  return (
    <main id="main" className="relative">
      <div className="mx-auto max-w-5xl px-5 pt-7 pb-10 sm:px-6 sm:pt-8 sm:pb-12">
        <p className="font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
          {APP_SERIES_LABEL}
        </p>
        <h1
          className="mt-2 text-3xl leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {APP_TAGLINE}
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {APP_NAME} scores eight dimensions, applies hard gates, and returns an
          advisory readiness report — not a certification.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            id="main-cta"
            href="/assess"
            className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          >
            Start assessment
          </Link>
          <Link
            href="/sample"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] px-5 py-2.5 text-sm text-[var(--foreground)] transition hover:bg-[var(--card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          >
            View sample report
          </Link>
        </div>

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
