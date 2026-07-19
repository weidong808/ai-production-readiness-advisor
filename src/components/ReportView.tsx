"use client";

import { useEffect, useState } from "react";
import { BandBadge } from "@/components/BandBadge";
import { reportToJson, reportToMarkdown } from "@/lib/export/report";
import type { ReadinessReport } from "@/lib/schema/narrative";
import type { AssessmentInput, ScoringResult } from "@/lib/scoring/types";

type LoadState = "idle" | "loading" | "done" | "error";

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function scoresOnlyFallback(
  input: AssessmentInput,
  result: ScoringResult,
  status: "unavailable" | "schema_failed",
): ReadinessReport {
  return {
    schemaVersion: "report@0.1.0",
    context: {
      assessmentId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      rubricVersion: result.rubricVersion,
      questionsVersion: result.questionsVersion,
      corpusVersion: "corpus@0.1.0",
      ...input.context,
    },
    overallScore: result.overallScore,
    scoreBand: result.scoreBand,
    finalBand: result.finalBand,
    hardGatesApplied: result.hardGatesApplied,
    dimensions: result.dimensions,
    executiveSummary: "",
    dimensionNarratives: [],
    risks: [],
    remediationPlan: [],
    citations: [],
    disclaimer: "Advisory only. Not a certification, audit, or legal opinion.",
    qualityFlags: [],
    model: {
      provider: "openai",
      modelId: "local",
      promptVersion: "narrative@0.1.0",
      narrativeStatus: status,
    },
  };
}

export function ReportView({
  input,
  result,
  onRestart,
  onBack,
  preloadedReport,
  sampleMode = false,
}: {
  input: AssessmentInput;
  result: ScoringResult;
  onRestart: () => void;
  onBack: () => void;
  /** When set, skip the narrative API and render immediately. */
  preloadedReport?: ReadinessReport;
  sampleMode?: boolean;
}) {
  const [state, setState] = useState<LoadState>(
    preloadedReport ? "done" : "idle",
  );
  const [report, setReport] = useState<ReadinessReport | null>(
    preloadedReport ?? null,
  );
  const [metaNote, setMetaNote] = useState<string | null>(null);

  // Stable key so parent re-renders do not retrigger OpenAI calls.
  const requestKey = JSON.stringify({
    context: input.context,
    answers: input.answers,
    freeText: input.freeText ?? {},
  });

  useEffect(() => {
    if (preloadedReport) return;

    let cancelled = false;
    const snapshotInput = JSON.parse(requestKey) as {
      context: AssessmentInput["context"];
      answers: AssessmentInput["answers"];
      freeText: AssessmentInput["freeText"];
    };
    const assessmentInput: AssessmentInput = {
      context: snapshotInput.context,
      answers: snapshotInput.answers,
      freeText: snapshotInput.freeText,
    };

    async function run() {
      setState("loading");
      setMetaNote(null);
      try {
        const res = await fetch("/api/assess/narrative", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: assessmentInput }),
        });
        const data = (await res.json()) as {
          report?: ReadinessReport;
          meta?: { rateLimited?: boolean; reason?: string; error?: string };
          error?: string;
        };
        if (cancelled) return;
        if (!data.report) {
          setReport(scoresOnlyFallback(assessmentInput, result, "unavailable"));
          setMetaNote(data.error || "Narrative unavailable");
          setState("error");
          return;
        }
        // Trust server recomputed band, not client preview
        setReport(data.report);
        if (data.meta?.rateLimited) {
          setMetaNote(
            "Narrative rate limit reached (best-effort under serverless) — showing scores only.",
          );
        } else if (data.report.model.narrativeStatus !== "ok") {
          setMetaNote(
            `Narrative ${data.report.model.narrativeStatus.replace("_", " ")} — scores and band still apply.`,
          );
        }
        setState("done");
      } catch {
        if (cancelled) return;
        setReport(scoresOnlyFallback(assessmentInput, result, "unavailable"));
        setMetaNote("Could not reach narrative service — showing scores only.");
        setState("error");
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
    // result used only for local fallback if the API fails before scoring
    // eslint-disable-next-line react-hooks/exhaustive-deps -- requestKey is the intentional trigger
  }, [requestKey, preloadedReport]);

  const view = report ?? scoresOnlyFallback(input, result, "unavailable");
  const slug = input.context.systemName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "assessment";
  const filePrefix = sampleMode ? `sample-${slug}` : slug;

  return (
    <div className="report-print-root space-y-8">
      <header className="space-y-3">
        <p className="text-sm text-[var(--ink-muted)]">
          {sampleMode ? "Sample readiness report" : "Readiness report"}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">
          {view.context.systemName}
        </h2>
        <p className="text-[var(--ink-muted)]">{view.context.jobToBeDone}</p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <BandBadge band={view.finalBand} />
          <span className="text-sm text-[var(--ink-muted)]">
            Overall score {view.overallScore} · score band {view.scoreBand}
          </span>
        </div>
        <p className="rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--ink-muted)]">
          {view.disclaimer}
        </p>
        <div aria-live="polite" aria-atomic="true">
          {state === "loading" && (
            <p className="text-sm text-[var(--accent)]" role="status">
              Generating advisory narrative…
            </p>
          )}
          {metaNote && (
            <p className="text-sm text-[var(--warn)]" role="status">
              {metaNote}
            </p>
          )}
        </div>
      </header>

      {view.qualityFlags.length > 0 && (
        <section className="space-y-2" aria-label="Quality flags">
          <h3 className="text-sm font-semibold tracking-wide text-[var(--ink-muted)] uppercase">
            Quality flags
          </h3>
          <ul className="space-y-1 text-sm text-[var(--warn)]">
            {view.qualityFlags.map((flag) => (
              <li key={flag}>{flag.split("_").join(" ")}</li>
            ))}
          </ul>
        </section>
      )}

      {view.executiveSummary && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-[var(--ink-muted)] uppercase">
            Executive summary
          </h3>
          <p className="rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-3 text-sm leading-relaxed">
            {view.executiveSummary}
          </p>
        </section>
      )}

      {view.hardGatesApplied.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-[var(--ink-muted)] uppercase">
            Hard gates applied
          </h3>
          <ul className="space-y-2">
            {view.hardGatesApplied.map((gate) => (
              <li
                key={gate.gateId}
                className="rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
              >
                <span className="font-medium text-[var(--warn)]">
                  {gate.gateId}
                </span>
                <span className="text-[var(--ink-muted)]">
                  {" "}
                  → ceiling {gate.ceiling}
                </span>
                <p className="mt-1 text-[var(--ink)]">{gate.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide text-[var(--ink-muted)] uppercase">
          Dimension scores
        </h3>
        <div className="space-y-2">
          {view.dimensions.map((dim) => (
            <div
              key={dim.dimensionId}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2"
            >
              <span className="text-xs font-semibold text-[var(--accent)]">
                {dim.dimensionId}
              </span>
              <div>
                <p className="text-sm font-medium">{dim.name}</p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--bg-soft)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{dim.score}</p>
                <BandBadge band={dim.band} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {view.dimensionNarratives.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-[var(--ink-muted)] uppercase">
            Dimension notes
          </h3>
          <ul className="space-y-2">
            {view.dimensionNarratives.map((n) => (
              <li
                key={n.dimensionId}
                className="rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
              >
                <p className="font-medium text-[var(--accent)]">
                  {n.dimensionId}
                </p>
                <p className="mt-1 leading-relaxed">{n.narrative}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {view.risks.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-[var(--ink-muted)] uppercase">
            Risks
          </h3>
          <ul className="space-y-2">
            {view.risks.map((r) => (
              <li
                key={r.id}
                className="rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
              >
                <p className="font-medium">
                  <span className="text-[var(--warn)]">[{r.severity}]</span>{" "}
                  {r.title}
                </p>
                <p className="mt-1 text-[var(--ink-muted)]">{r.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {view.remediationPlan.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-[var(--ink-muted)] uppercase">
            Remediation plan
          </h3>
          <ol className="space-y-2">
            {[...view.remediationPlan]
              .sort((a, b) => a.priority - b.priority)
              .map((m) => (
                <li
                  key={m.id}
                  className="rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
                >
                  <p className="font-medium">
                    {m.priority}. {m.title}{" "}
                    <span className="text-[var(--ink-muted)]">({m.effort})</span>
                  </p>
                  <p className="mt-1 text-[var(--ink-muted)]">{m.description}</p>
                </li>
              ))}
          </ol>
        </section>
      )}

      {view.citations.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-[var(--ink-muted)] uppercase">
            Citations
          </h3>
          <ul className="space-y-1 text-sm text-[var(--ink-muted)]">
            {view.citations.map((c) => (
              <li key={c.id}>
                <span className="font-medium text-[var(--ink)]">{c.id}</span> —{" "}
                {c.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="text-xs text-[var(--ink-muted)]">
        {view.context.rubricVersion} · {view.context.corpusVersion} ·{" "}
        {view.model.promptVersion} · narrative={view.model.narrativeStatus}
        {sampleMode ? " · sample" : ""}
      </section>

      <div className="no-print flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-[var(--line)] px-4 py-2 text-sm hover:bg-[var(--bg-soft)]"
        >
          {sampleMode ? "Back home" : "Back to review"}
        </button>
        <button
          type="button"
          onClick={() =>
            download(
              `${filePrefix}-readiness.md`,
              reportToMarkdown(view),
              "text/markdown;charset=utf-8",
            )
          }
          className="rounded-md border border-[var(--line)] px-4 py-2 text-sm hover:bg-[var(--bg-soft)]"
        >
          Export Markdown
        </button>
        <button
          type="button"
          onClick={() =>
            download(
              `${filePrefix}-readiness.json`,
              reportToJson(view),
              "application/json;charset=utf-8",
            )
          }
          className="rounded-md border border-[var(--line)] px-4 py-2 text-sm hover:bg-[var(--bg-soft)]"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md border border-[var(--line)] px-4 py-2 text-sm hover:bg-[var(--bg-soft)]"
        >
          Print / PDF
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] hover:brightness-110"
        >
          {sampleMode ? "Start your assessment" : "Start over"}
        </button>
      </div>
    </div>
  );
}
