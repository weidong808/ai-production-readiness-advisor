"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ReportView } from "@/components/ReportView";
import {
  CONTEXT_FIELDS,
  DIMENSION_META,
  FREE_TEXT_FIELDS,
  questionsForDimension,
} from "@/lib/questions/bank";
import {
  clearAssessment,
  loadAssessment,
  saveAssessment,
} from "@/lib/persistence/local";
import { scoreAssessment } from "@/lib/scoring/score";
import type {
  AssessmentContext,
  AssessmentInput,
  DimensionId,
  OrdinalChoice,
} from "@/lib/scoring/types";
import { DIMENSION_IDS } from "@/lib/scoring/types";

type Step =
  | "context"
  | DimensionId
  | "notes"
  | "review"
  | "report";

const DEFAULT_CONTEXT: AssessmentContext = {
  systemName: "",
  jobToBeDone: "",
  audience: "employees",
  interactionMode: "assistive",
  dataSensitivity: "internal",
  blastRadius: "recoverable",
  targetEnvironment: "pilot",
};

function emptyAnswers(): Record<string, OrdinalChoice | undefined> {
  return {};
}

export function AssessmentWizard() {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>("context");
  const [context, setContext] = useState<AssessmentContext>(DEFAULT_CONTEXT);
  const [answers, setAnswers] = useState<Record<string, OrdinalChoice | undefined>>(
    emptyAnswers,
  );
  const [freeText, setFreeText] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = loadAssessment();
    if (saved) {
      setContext(saved.input.context);
      setAnswers(saved.input.answers);
      setFreeText(saved.input.freeText ?? {});
      setStep((saved.step as Step) || "context");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const input: AssessmentInput = {
      context,
      answers: Object.fromEntries(
        Object.entries(answers).filter((entry): entry is [string, OrdinalChoice] =>
          Boolean(entry[1]),
        ),
      ),
      freeText,
    };
    saveAssessment({
      version: 1,
      updatedAt: new Date().toISOString(),
      step,
      input,
    });
  }, [hydrated, step, context, answers, freeText]);

  const steps: Step[] = [
    "context",
    ...DIMENSION_IDS,
    "notes",
    "review",
    "report",
  ];

  const stepIndex = steps.indexOf(step);
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  const input: AssessmentInput = {
    context,
    answers: Object.fromEntries(
      Object.entries(answers).filter((entry): entry is [string, OrdinalChoice] =>
        Boolean(entry[1]),
      ),
    ),
    freeText,
  };

  const result = scoreAssessment(input);

  const contextValid =
    context.systemName.trim().length > 0 &&
    context.jobToBeDone.trim().length > 0;

  function goNext() {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]!);
  }

  function goBack() {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]!);
  }

  function restart() {
    clearAssessment();
    setContext(DEFAULT_CONTEXT);
    setAnswers(emptyAnswers());
    setFreeText({});
    setStep("context");
  }

  if (!hydrated) {
    return (
      <p className="text-sm text-[var(--ink-muted)]">Loading assessment…</p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
        >
          ← AI Production Readiness Advisor
        </Link>
        <button
          type="button"
          onClick={restart}
          className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
        >
          Reset
        </button>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-[var(--ink-muted)]">
          <span>
            Step {stepIndex + 1} of {steps.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-soft)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {step === "context" && (
        <section className="space-y-6">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">Context</h1>
            <p className="mt-2 text-[var(--ink-muted)]">
              Frame the system so hard gates can apply correctly.
            </p>
          </header>
          <div className="space-y-4">
            {CONTEXT_FIELDS.map((field) => (
              <label key={field.id} className="block space-y-1.5">
                <span className="text-sm font-medium">{field.label}</span>
                {field.kind === "text" ? (
                  <input
                    className="w-full rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                    value={String(
                      context[field.id as keyof AssessmentContext] ?? "",
                    )}
                    placeholder={field.placeholder}
                    onChange={(e) =>
                      setContext((prev) => ({
                        ...prev,
                        [field.id]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <select
                    className="w-full rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                    value={String(
                      context[field.id as keyof AssessmentContext] ?? "",
                    )}
                    onChange={(e) =>
                      setContext((prev) => ({
                        ...prev,
                        [field.id]: e.target.value,
                      }))
                    }
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </label>
            ))}
          </div>
          <NavButtons
            onBack={undefined}
            onNext={goNext}
            nextDisabled={!contextValid}
            nextLabel="Continue to dimensions"
          />
        </section>
      )}

      {DIMENSION_IDS.includes(step as DimensionId) && (
        <DimensionStep
          dimensionId={step as DimensionId}
          answers={answers}
          onAnswer={(questionId, choice) =>
            setAnswers((prev) => ({ ...prev, [questionId]: choice }))
          }
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {step === "notes" && (
        <section className="space-y-6">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">
              Optional notes
            </h1>
            <p className="mt-2 text-[var(--ink-muted)]">
              Stored only in this browser. Not scored.
            </p>
          </header>
          <div className="space-y-4">
            {FREE_TEXT_FIELDS.map((field) => (
              <label key={field.id} className="block space-y-1.5">
                <span className="text-sm font-medium">{field.label}</span>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                  value={freeText[field.id] ?? ""}
                  onChange={(e) =>
                    setFreeText((prev) => ({
                      ...prev,
                      [field.id]: e.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <NavButtons onBack={goBack} onNext={goNext} nextLabel="Review" />
        </section>
      )}

      {step === "review" && (
        <section className="space-y-6">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">Review</h1>
            <p className="mt-2 text-[var(--ink-muted)]">
              Preview deterministic scores before opening the full report.
            </p>
          </header>
          <div className="rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-3">
            <p className="text-sm text-[var(--ink-muted)]">Projected band</p>
            <p className="mt-1 text-xl font-semibold">{result.finalBand}</p>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              Overall {result.overallScore} · {result.hardGatesApplied.length}{" "}
              hard gate
              {result.hardGatesApplied.length === 1 ? "" : "s"}
            </p>
          </div>
          <NavButtons
            onBack={goBack}
            onNext={() => setStep("report")}
            nextLabel="See full report"
          />
        </section>
      )}

      {step === "report" && (
        <ReportView
          input={input}
          result={result}
          onBack={() => setStep("review")}
          onRestart={restart}
        />
      )}
    </div>
  );
}

function DimensionStep({
  dimensionId,
  answers,
  onAnswer,
  onBack,
  onNext,
}: {
  dimensionId: DimensionId;
  answers: Record<string, OrdinalChoice | undefined>;
  onAnswer: (questionId: string, choice: OrdinalChoice) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const meta = DIMENSION_META[dimensionId];
  const questions = questionsForDimension(dimensionId);
  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          {dimensionId}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {meta.name}
        </h1>
        <p className="mt-2 text-[var(--ink-muted)]">{meta.summary}</p>
      </header>
      <div className="space-y-6">
        {questions.map((q) => (
          <fieldset key={q.id} className="space-y-2">
            <legend className="text-sm font-medium">{q.prompt}</legend>
            <div className="space-y-2">
              {q.choices.map((choice) => {
                const selected = answers[q.id] === choice.value;
                return (
                  <label
                    key={choice.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 text-sm transition ${
                      selected
                        ? "border-[var(--accent)] bg-[rgba(61,154,139,0.12)]"
                        : "border-[var(--line)] bg-[var(--bg-elevated)] hover:border-[rgba(61,154,139,0.4)]"
                    }`}
                  >
                    <input
                      type="radio"
                      className="mt-1"
                      name={q.id}
                      checked={selected}
                      onChange={() => onAnswer(q.id, choice.value)}
                    />
                    <span>
                      <span className="font-semibold text-[var(--accent)]">
                        {choice.value}.
                      </span>{" "}
                      {choice.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!allAnswered}
        nextLabel="Continue"
      />
    </section>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continue",
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-[var(--line)] px-4 py-2 text-sm hover:bg-[var(--bg-soft)]"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#06120f] hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
}
