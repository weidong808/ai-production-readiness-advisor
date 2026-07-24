import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getCachedNarrative,
  narrativeCacheKey,
  setCachedNarrative,
} from "@/lib/ai/cache";
import { buildScoresOnlyReport } from "@/lib/ai/merge";
import { MAX_BODY_BYTES, readJsonBodyWithLimit, truncateFreeText } from "@/lib/ai/limits";
import { generateNarrative, getOpenAIConfig } from "@/lib/ai/openai";
import { PROMPT_VERSION } from "@/lib/ai/prompt";
import { runNarrativePipeline } from "@/lib/ai/pipeline";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { CORPUS_VERSION } from "@/lib/corpus/load";
import { narrativeRequestSchema } from "@/lib/schema/narrative";
import { scoreAssessment } from "@/lib/scoring/score";

export const runtime = "nodejs";
// Allow enough time for the LLM narrative call to complete on Vercel.
export const maxDuration = 30;

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function logEvent(payload: Record<string, unknown>) {
  // Structured logs only — never include free-text answers by default.
  console.info(JSON.stringify(payload));
}

export async function POST(req: Request) {
  const started = Date.now();
  const { apiKey, model, enabled } = getOpenAIConfig();

  const bodyRead = await readJsonBodyWithLimit(req, MAX_BODY_BYTES);
  if (!bodyRead.ok) {
    logEvent({
      event: "narrative_bad_request",
      error: bodyRead.error,
      latencyMs: Date.now() - started,
    });
    return NextResponse.json({ error: bodyRead.error }, { status: 400 });
  }

  const parsed = narrativeRequestSchema.safeParse(bodyRead.body);
  if (!parsed.success) {
    logEvent({
      event: "narrative_invalid_schema",
      latencyMs: Date.now() - started,
    });
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const assessmentId = parsed.data.assessmentId ?? randomUUID();
  const createdAt = new Date().toISOString();
  const input = {
    ...parsed.data.input,
    freeText: truncateFreeText(parsed.data.input.freeText),
  };

  // Always recompute scores server-side — never trust client band.
  const scoring = scoreAssessment(input);

  const ip = clientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    const report = buildScoresOnlyReport({
      assessmentId,
      createdAt,
      input,
      scoring,
      narrativeStatus: "unavailable",
      modelId: model,
    });
    logEvent({
      event: "narrative_rate_limited",
      assessmentId,
      finalBand: scoring.finalBand,
      latencyMs: Date.now() - started,
    });
    return NextResponse.json({
      report,
      meta: { rateLimited: true, remaining: 0, limit: limit.limit },
    });
  }

  if (!enabled || !apiKey) {
    const report = buildScoresOnlyReport({
      assessmentId,
      createdAt,
      input,
      scoring,
      narrativeStatus: "unavailable",
      modelId: model,
    });
    logEvent({
      event: "narrative_disabled",
      assessmentId,
      reason: !apiKey ? "missing_api_key" : "disabled",
      latencyMs: Date.now() - started,
    });
    return NextResponse.json({
      report,
      meta: { reason: !apiKey ? "missing_api_key" : "disabled" },
    });
  }

  const cacheKey = narrativeCacheKey({
    input,
    scoring,
    corpusVersion: CORPUS_VERSION,
    promptVersion: PROMPT_VERSION,
    model,
  });
  const cached = getCachedNarrative(cacheKey);
  if (cached) {
    logEvent({
      event: "narrative_cache_hit",
      assessmentId,
      narrativeStatus: cached.model.narrativeStatus,
      finalBand: cached.finalBand,
      latencyMs: Date.now() - started,
    });
    return NextResponse.json({
      report: {
        ...cached,
        context: { ...cached.context, assessmentId, createdAt },
      },
      meta: { cached: true, remaining: limit.remaining, limit: limit.limit },
    });
  }

  const result = await runNarrativePipeline({
    assessmentId,
    createdAt,
    input,
    modelIdFallback: model,
    generate: generateNarrative,
  });

  if (result.report.model.narrativeStatus === "ok") {
    setCachedNarrative(cacheKey, result.report);
  }

  if (result.meta.repaired && result.report.model.narrativeStatus === "ok") {
    logEvent({
      event: "narrative_repaired",
      assessmentId,
      finalBand: result.report.finalBand,
      latencyMs: Date.now() - started,
    });
  }

  logEvent({
    event: `narrative_${result.report.model.narrativeStatus}`,
    assessmentId,
    finalBand: result.report.finalBand,
    overallScore: result.report.overallScore,
    qualityFlags: result.report.qualityFlags,
    redactions: result.meta.redactions,
    shapeErrors: result.meta.shapeErrors,
    schemaIssues: result.meta.schemaIssues,
    providerError: result.meta.providerError,
    repaired: result.meta.repaired || false,
    corpusVersion: CORPUS_VERSION,
    promptVersion: PROMPT_VERSION,
    latencyMs: Date.now() - started,
  });

  return NextResponse.json({
    report: result.report,
    meta: {
      remaining: limit.remaining,
      limit: limit.limit,
      redactions: result.meta.redactions,
      qualityFlags: result.report.qualityFlags,
      providerError: result.meta.providerError,
      repaired: result.meta.repaired || false,
      rateLimitMode: "best_effort_in_memory",
    },
  });
}
