"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BandBadge } from "@/components/BandBadge";
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

function stepHeading(step: Step): string {
  if (step === "context") return "Context";
  if (step === "notes") return "Optional notes";
  if (step === "review") return "Review";
  if (step === "report") return "Readiness report";
  return DIMENSION_META[step].name;
}

export function AssessmentWizard() {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>("context");
  const [context, setContext] = useState<AssessmentContext>(DEFAULT_CONTEXT);
  const [answers, setAnswers] = useState<Record<string, OrdinalChoice | undefined>>(
    emptyAnswers,
  );
  const [freeText, setFreeText] = useState<Record<string, string>>({});
  const [returnToReview, setReturnToReview] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skipStepChangeFocus = useRef(true);

  useEffect(() => {
    const saved = loadAssessment();
    if (saved) {
      /* eslint-disable react-hooks/set-state-in-effect -- hydrate persisted wizard once on mount */
      setContext(saved.input.context);
      setAnswers(saved.input.answers);
      setFreeText(saved.input.freeText ?? {});
      setStep((saved.step as Step) || "context");
      /* eslint-enable react-hooks/set-state-in-effect */
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

  // Move focus to the step heading after navigation (keyboard / screen-reader).
  useEffect(() => {
    if (!hydrated) return;
    if (skipStepChangeFocus.current) {
      skipStepChangeFocus.current = false;
      return;
    }
    if (step === "report") return;
    headingRef.current?.focus();
  }, [step, hydrated]);

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
    if (returnToReview) {
      setReturnToReview(false);
      setStep("review");
      return;
    }
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]!);
  }

  function goBack() {
    if (returnToReview) {
      setReturnToReview(false);
      setStep("review");
      return;
    }
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]!);
  }

  function restart() {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Reset the assessment? All answers in this browser will be cleared.",
      )
    ) {
      return;
    }
    clearAssessment();
    setContext(DEFAULT_CONTEXT);
    setAnswers(emptyAnswers());
    setFreeText({});
    setStep("context");
  }

  if (!hydrated) {
    return (
      <main id="main" className="ui-shell">
        <p className="text-sm text-[var(--muted)]" role="status" aria-live="polite">
          Loading assessment…
        </p>
      </main>
    );
  }

  return (
    <main id="main" className="ui-shell">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="ui-eyebrow">Assessment</p>
        <button
          type="button"
          onClick={restart}
          className="ui-btn ui-btn-secondary text-[var(--muted)]"
        >
          Reset
        </button>
      </div>

      {step !== "report" && (
        <div
          className="mb-5"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={stepIndex + 1}
          aria-valuetext={`Step ${stepIndex + 1} of ${steps.length}: ${stepHeading(step)}`}
          aria-label="Assessment progress"
        >
          <div className="mb-1.5 flex justify-between text-xs text-[var(--muted)]">
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
      )}

      {step === "context" && (
        <section className="space-y-5" aria-labelledby="step-heading">
          <header>
            <h1
              id="step-heading"
              ref={headingRef}
              tabIndex={-1}
              className="ui-title outline-none"
            >
              Context
            </h1>
            <p className="ui-lead">
              Frame the system so hard gates can apply correctly.
            </p>
          </header>
          <div className="space-y-3">
            {CONTEXT_FIELDS.map((field) => (
              <label key={field.id} className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {field.label}
                </span>
                {field.kind === "text" ? (
                  <input
                    className="ui-field"
                    value={String(
                      context[field.id as keyof AssessmentContext] ?? "",
                    )}
                    placeholder={field.placeholder}
                    required={field.required}
                    aria-required={field.required}
                    onChange={(e) =>
                      setContext((prev) => ({
                        ...prev,
                        [field.id]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <select
                    className="ui-field"
                    value={String(
                      context[field.id as keyof AssessmentContext] ?? "",
                    )}
                    required={field.required}
                    aria-required={field.required}
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
            disabledHint="Enter a system name and job-to-be-done to continue."
          />
        </section>
      )}

      {DIMENSION_IDS.includes(step as DimensionId) && (
        <DimensionStep
          dimensionId={step as DimensionId}
          dimensionNumber={DIMENSION_IDS.indexOf(step as DimensionId) + 1}
          dimensionCount={DIMENSION_IDS.length}
          answers={answers}
          headingRef={headingRef}
          onAnswer={(questionId, choice) =>
            setAnswers((prev) => ({ ...prev, [questionId]: choice }))
          }
          onBack={goBack}
          onNext={goNext}
          nextLabel={returnToReview ? "Return to review" : "Continue"}
        />
      )}

      {step === "notes" && (
        <section className="space-y-5" aria-labelledby="step-heading">
          <header>
            <h1
              id="step-heading"
              ref={headingRef}
              tabIndex={-1}
              className="ui-title outline-none"
            >
              Optional notes
            </h1>
            <p className="ui-lead">
              Stored only in this browser. Not scored.
            </p>
          </header>
          <div className="space-y-3">
            {FREE_TEXT_FIELDS.map((field) => (
              <label key={field.id} className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {field.label}
                </span>
                <textarea
                  rows={3}
                  className="ui-field"
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
        <section className="space-y-5" aria-labelledby="step-heading">
          <header>
            <h1
              id="step-heading"
              ref={headingRef}
              tabIndex={-1}
              className="ui-title outline-none"
            >
              Review
            </h1>
            <p className="ui-lead">
              Preview deterministic scores before opening the full report.
            </p>
          </header>

          <div className="ui-card">
            <p className="ui-section-label">Projected band</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <BandBadge band={result.finalBand} />
              <p className="text-sm text-[var(--muted)]">
                Overall {result.overallScore} · {result.hardGatesApplied.length}{" "}
                hard gate
                {result.hardGatesApplied.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {result.hardGatesApplied.length > 0 && (
            <div className="space-y-2" aria-label="Hard gates preview">
              <p className="ui-section-label">Hard gates applied</p>
              <ul className="space-y-2">
                {result.hardGatesApplied.map((gate) => (
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
            </div>
          )}

          <div className="space-y-2">
            <p className="ui-section-label">Dimension scores</p>
            <ul className="space-y-2">
              {result.dimensions.map((dim) => (
                <li
                  key={dim.dimensionId}
                  className="ui-card grid grid-cols-[auto_1fr_auto_auto] items-center gap-3"
                >
                  <span className="text-xs font-semibold text-[var(--accent)]">
                    {dim.dimensionId}
                  </span>
                  <span className="text-sm text-[var(--foreground)]">
                    {dim.name}
                  </span>
                  <span className="text-sm font-semibold">{dim.score}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setReturnToReview(true);
                      setStep(dim.dimensionId);
                    }}
                    className="text-sm text-[var(--muted)] underline-offset-2 hover:text-[var(--foreground)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                    aria-label={`Edit answers for ${dim.name}`}
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
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
    </main>
  );
}

function DimensionStep({
  dimensionId,
  dimensionNumber,
  dimensionCount,
  answers,
  headingRef,
  onAnswer,
  onBack,
  onNext,
  nextLabel = "Continue",
}: {
  dimensionId: DimensionId;
  dimensionNumber: number;
  dimensionCount: number;
  answers: Record<string, OrdinalChoice | undefined>;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onAnswer: (questionId: string, choice: OrdinalChoice) => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  const meta = DIMENSION_META[dimensionId];
  const questions = questionsForDimension(dimensionId);
  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const allAnswered = answeredCount === questions.length;
  const hintId = useId();

  return (
    <section className="space-y-5" aria-labelledby="step-heading">
      <header>
        <p className="ui-eyebrow">
          {dimensionId} · Dimension {dimensionNumber} of {dimensionCount}
        </p>
        <h1
          id="step-heading"
          ref={headingRef}
          tabIndex={-1}
          className="ui-title mt-1 outline-none"
        >
          {meta.name}
        </h1>
        <p className="ui-lead">{meta.summary}</p>
      </header>
      <div className="space-y-5">
        {questions.map((q) => (
          <fieldset key={q.id} className="space-y-2">
            <legend className="text-sm font-medium text-[var(--foreground)]">
              {q.prompt}
            </legend>
            <div className="space-y-2">
              {q.choices.map((choice) => {
                const selected = answers[q.id] === choice.value;
                return (
                  <label key={choice.value} className="ui-choice">
                    <input
                      type="radio"
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
      {!allAnswered && (
        <p
          id={hintId}
          className="text-sm text-[var(--muted)]"
          role="status"
          aria-live="polite"
        >
          {answeredCount} of {questions.length} questions answered — answer all
          to continue.
        </p>
      )}
      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!allAnswered}
        nextLabel={nextLabel}
        disabledHintId={!allAnswered ? hintId : undefined}
        disabledHint={
          !allAnswered
            ? `Answer all ${questions.length} questions to continue.`
            : undefined
        }
      />
    </section>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continue",
  disabledHint,
  disabledHintId,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  disabledHint?: string;
  disabledHintId?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      {onBack && (
        <button type="button" onClick={onBack} className="ui-btn ui-btn-secondary">
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        aria-disabled={nextDisabled}
        aria-describedby={nextDisabled ? disabledHintId : undefined}
        title={nextDisabled ? disabledHint : undefined}
        className="ui-btn ui-btn-primary"
      >
        {nextLabel}
      </button>
    </div>
  );
}
