import type { Metadata } from "next";
import { SampleReportClient } from "@/components/SampleReportClient";
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
    <main id="main" className="mx-auto max-w-3xl px-5 py-8 sm:px-6 sm:py-10">
      <SampleReportClient input={input} result={result} report={report} />
    </main>
  );
}
