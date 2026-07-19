"use client";

import { useRouter } from "next/navigation";
import { ReportView } from "@/components/ReportView";
import { SampleReportBanner } from "@/components/SampleReportBanner";
import type { ReadinessReport } from "@/lib/schema/narrative";
import type { AssessmentInput, ScoringResult } from "@/lib/scoring/types";

export function SampleReportClient({
  input,
  result,
  report,
}: {
  input: AssessmentInput;
  result: ScoringResult;
  report: ReadinessReport;
}) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <SampleReportBanner />
      <ReportView
        input={input}
        result={result}
        preloadedReport={report}
        sampleMode
        onBack={() => router.push("/")}
        onRestart={() => router.push("/assess")}
      />
    </div>
  );
}
