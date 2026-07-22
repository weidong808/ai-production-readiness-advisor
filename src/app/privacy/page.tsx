import type { Metadata } from "next";
import Link from "next/link";
import {
  ADVISORY_DISCLAIMER,
  APP_NAME,
  APP_SERIES_LABEL,
  APP_URL,
  SITE_HOME_URL,
} from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy · ${APP_NAME}`,
  description: `How ${APP_NAME} handles assessment answers, OpenAI narrative calls, and page analytics.`,
};

export default function PrivacyPage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-5 py-8 sm:px-6 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
        {APP_SERIES_LABEL} · Privacy
      </p>
      <h1
        className="mt-2 text-3xl tracking-tight text-[var(--foreground)] sm:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Privacy
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
        What stays in your browser, what the server sees briefly, and how
        analytics work.
      </p>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-[var(--muted)]">
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Assessment answers
          </h2>
          <p className="mt-2">
            Your answers stay in this browser. There is no account. Answers are
            sent to the server only to score and generate the advisory narrative,
            held briefly in a short-lived in-memory cache, never written to a
            database, and never used for model training.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            OpenAI narrative
          </h2>
          <p className="mt-2">
            When narrative generation is enabled, the server sends the scored
            assessment context to OpenAI to produce an executive summary, risks,
            and remediation wording with corpus citations. Deterministic scores
            and hard-gate bands are computed in our code — the model does not set
            the readiness band. If the model fails, a scores-only report is still
            available.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Analytics
          </h2>
          <p className="mt-2">
            The live site at{" "}
            <a
              href={APP_URL}
              className="text-[var(--accent)] underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {APP_URL.replace("https://", "")}
            </a>{" "}
            may record privacy-friendly page views via Vercel Analytics.
            Assessment answers are not sent as analytics events.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Advisory framing
          </h2>
          <p className="mt-2">
            {ADVISORY_DISCLAIMER} Use the report as a structured conversation
            starter — not as certification or sign-off.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Related
          </h2>
          <p className="mt-2">
            Parent site:{" "}
            <a
              href={SITE_HOME_URL}
              className="text-[var(--accent)] underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              weidong-shi.com
            </a>
            . Product background:{" "}
            <Link
              href="/about"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              About
            </Link>
            .
          </p>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/assess"
          className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] transition hover:brightness-110"
        >
          Start assessment
        </Link>
        <Link
          href="/"
          className="rounded-md border border-[var(--border)] px-5 py-2.5 text-sm hover:bg-[var(--card)]"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
