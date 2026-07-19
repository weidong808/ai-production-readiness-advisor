import type { Metadata } from "next";
import Link from "next/link";
import { SampleReportClient } from "@/components/SampleReportClient";
import { SiteHomeLink } from "@/components/SiteHomeLink";
import { APP_NAME } from "@/lib/brand";
import {
  getSampleAssessmentInput,
  getSampleReport,
  getSampleScoringResult,
} from "@/lib/sample/load";

export const metadata: Metadata = {
  title: `Sample report · ${APP_NAME}`,
  description:
    "A pre-generated Production with Guards readiness report — no OpenAI call required.",
};

export default function SamplePage() {
  const report = getSampleReport();
  const input = getSampleAssessmentInput();
  const result = getSampleScoringResult();

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
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
      <SampleReportClient input={input} result={result} report={report} />
    </main>
  );
}
