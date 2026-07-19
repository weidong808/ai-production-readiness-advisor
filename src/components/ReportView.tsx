"use client";

import { useEffect, useRef, useState } from "react";
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
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- requestKey is the intentional trigger
  }, [requestKey, preloadedReport]);

  const view = report ?? scoresOnlyFallback(input, result, "unavailable");
  const slug =
    input.context.systemName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "assessment";
  const filePrefix = sampleMode ? `sample-${slug}` : slug;

  return (
    <div className="report-print-root space-y-5">
      <header className="space-y-2.5">
        <p className="ui-eyebrow">
          {sampleMode ? "Sample readiness report" : "Readiness report"}
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="ui-title text-[1.65rem] outline-none"
        >
          {view.context.systemName}
        </h2>
        <p className="ui-lead mt-1">{view.context.jobToBeDone}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <BandBadge band={view.finalBand} />
          <span className="text-sm text-[var(--muted)]">
            Overall score {view.overallScore} · score band {view.scoreBand}
          </span>
        </div>
        <p className="ui-card text-sm text-[var(--muted)]">{view.disclaimer}</p>
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
        <section className="space-y-2" aria-labelledby="quality-flags-heading">
          <h3 id="quality-flags-heading" className="ui-section-label">
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
        <section className="space-y-2" aria-labelledby="exec-summary-heading">
          <h3 id="exec-summary-heading" className="ui-section-label">
            Executive summary
          </h3>
          <p className="ui-card text-sm leading-relaxed text-[var(--foreground)]">
            {view.executiveSummary}
          </p>
        </section>
      )}

      {view.hardGatesApplied.length > 0 && (
        <section className="space-y-2" aria-labelledby="hard-gates-heading">
          <h3 id="hard-gates-heading" className="ui-section-label">
            Hard gates applied
          </h3>
          <ul className="space-y-2">
            {view.hardGatesApplied.map((gate) => (
              <li key={gate.gateId} className="ui-card text-sm">
                <span className="font-medium text-[var(--warn)]">
                  {gate.gateId}
                </span>
                <span className="text-[var(--muted)]">
                  {" "}
                  → ceiling {gate.ceiling}
                </span>
                <p className="mt-1 text-[var(--foreground)]">{gate.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2" aria-labelledby="dimension-scores-heading">
        <h3 id="dimension-scores-heading" className="ui-section-label">
          Dimension scores
        </h3>
        <div className="space-y-2">
          {view.dimensions.map((dim) => (
            <div
              key={dim.dimensionId}
              className="ui-card grid grid-cols-[auto_1fr_auto] items-center gap-3"
            >
              <span className="text-xs font-semibold text-[var(--accent)]">
                {dim.dimensionId}
              </span>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {dim.name}
                </p>
                <div
                  className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--bg-soft)]"
                  role="meter"
                  aria-label={`${dim.name} score`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={dim.score}
                >
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
        <section className="space-y-2" aria-labelledby="dimension-notes-heading">
          <h3 id="dimension-notes-heading" className="ui-section-label">
            Dimension notes
          </h3>
          <ul className="space-y-2">
            {view.dimensionNarratives.map((n) => (
              <li key={n.dimensionId} className="ui-card text-sm">
                <p className="font-medium text-[var(--accent)]">
                  {n.dimensionId}
                </p>
                <p className="mt-1 leading-relaxed text-[var(--foreground)]">
                  {n.narrative}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {view.risks.length > 0 && (
        <section className="space-y-2" aria-labelledby="risks-heading">
          <h3 id="risks-heading" className="ui-section-label">
            Risks
          </h3>
          <ul className="space-y-2">
            {view.risks.map((r) => (
              <li key={r.id} className="ui-card text-sm">
                <p className="font-medium text-[var(--foreground)]">
                  <span className="text-[var(--warn)]">[{r.severity}]</span>{" "}
                  {r.title}
                </p>
                <p className="mt-1 text-[var(--muted)]">{r.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {view.remediationPlan.length > 0 && (
        <section className="space-y-2" aria-labelledby="remediation-heading">
          <h3 id="remediation-heading" className="ui-section-label">
            Remediation plan
          </h3>
          <ol className="space-y-2">
            {[...view.remediationPlan]
              .sort((a, b) => a.priority - b.priority)
              .map((m) => (
                <li key={m.id} className="ui-card text-sm">
                  <p className="font-medium text-[var(--foreground)]">
                    {m.priority}. {m.title}{" "}
                    <span className="text-[var(--muted)]">({m.effort})</span>
                  </p>
                  <p className="mt-1 text-[var(--muted)]">{m.description}</p>
                </li>
              ))}
          </ol>
        </section>
      )}

      {view.citations.length > 0 && (
        <section className="space-y-2" aria-labelledby="citations-heading">
          <h3 id="citations-heading" className="ui-section-label">
            Citations
          </h3>
          <ul className="space-y-1 text-sm text-[var(--muted)]">
            {view.citations.map((c) => (
              <li key={c.id}>
                <span className="font-medium text-[var(--foreground)]">
                  {c.id}
                </span>{" "}
                — {c.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="text-xs text-[var(--muted)]">
        {view.context.rubricVersion} · {view.context.corpusVersion} ·{" "}
        {view.model.promptVersion} · narrative={view.model.narrativeStatus}
        {sampleMode ? " · sample" : ""}
      </section>

      <div className="no-print flex flex-wrap gap-2.5" role="group" aria-label="Report actions">
        <button type="button" onClick={onBack} className="ui-btn ui-btn-secondary">
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
          className="ui-btn ui-btn-secondary"
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
          className="ui-btn ui-btn-secondary"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="ui-btn ui-btn-secondary"
        >
          Print / PDF
        </button>
        <button type="button" onClick={onRestart} className="ui-btn ui-btn-primary">
          {sampleMode ? "Start your assessment" : "Start over"}
        </button>
      </div>
    </div>
  );
}
