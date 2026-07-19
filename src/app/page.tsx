import Link from "next/link";
import { LandingPreview } from "@/components/LandingPreview";
import { SiteHomeLink } from "@/components/SiteHomeLink";
import { APP_NAME, APP_SERIES_LABEL } from "@/lib/brand";

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
    <main id="main" className="relative overflow-hidden">
      <a href="#main-cta" className="skip-link">
        Skip to start assessment
      </a>
      <div
        aria-hidden
        className="hero-grid pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,238,244,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,238,244,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 py-16">
        <div className="flex min-h-[min(70vh,36rem)] flex-col justify-center">
          <div className="hero-rise mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm tracking-[0.2em] text-[var(--accent)] uppercase">
              {APP_SERIES_LABEL}
            </p>
            <SiteHomeLink
              variant="compact"
              markSize={18}
              className="text-sm text-[var(--ink-muted)]"
            />
          </div>
          <h1
            className="hero-rise text-4xl leading-tight font-semibold tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {APP_NAME}
          </h1>
          <p className="hero-rise-delay mt-5 max-w-xl text-lg text-[var(--ink-muted)]">
            A guided assessment that scores eight dimensions, applies hard gates,
            and tells you whether an AI feature is ready to ship — advisory, not
            certification.
          </p>
          <div className="hero-rise-delay mt-10 flex flex-wrap items-center gap-4">
            <Link
              id="main-cta"
              href="/assess"
              className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#06120f] transition hover:bg-[var(--accent-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            >
              Start assessment
            </Link>
            <Link
              href="/sample"
              className="inline-flex items-center justify-center rounded-md border border-[var(--line)] px-5 py-3 text-sm transition hover:bg-[var(--bg-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            >
              View sample report
            </Link>
          </div>
        </div>

        <section className="mt-8 space-y-6 border-t border-[var(--line)] pt-14">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">How it works</h2>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              Three steps from context to an actionable readiness report.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="space-y-2">
                <p className="text-xs font-semibold tracking-wide text-[var(--accent)] uppercase">
                  Step {i + 1}
                </p>
                <p className="font-medium">{step.title}</p>
                <p className="text-sm text-[var(--ink-muted)]">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">What you get</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
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

        <p className="mt-14 text-center text-sm text-[var(--ink-muted)]">
          Deterministic scoring · answers stay in your browser · advisory, not
          certification
        </p>
      </div>
    </main>
  );
}
