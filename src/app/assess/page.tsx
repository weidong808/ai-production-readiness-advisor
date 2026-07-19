import type { Metadata } from "next";
import { AssessmentWizard } from "@/components/AssessmentWizard";

export const metadata: Metadata = {
  title: "Assessment · AI Production Readiness Advisor",
  description:
    "Complete the guided production-readiness assessment across eight dimensions.",
};

export default function AssessPage() {
  return (
    <main className="min-h-screen">
      <AssessmentWizard />
    </main>
  );
}
