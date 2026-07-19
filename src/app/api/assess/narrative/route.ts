import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getCachedNarrative,
  narrativeCacheKey,
  setCachedNarrative,
} from "@/lib/ai/cache";
import {
  buildScoresOnlyReport,
  extractJsonObject,
  mergeNarrativeReport,
} from "@/lib/ai/merge";
import { normalizeLlmNarrative } from "@/lib/ai/normalize";
import { generateNarrative, getOpenAIConfig } from "@/lib/ai/openai";
import { PROMPT_VERSION } from "@/lib/ai/prompt";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { CORPUS_VERSION } from "@/lib/corpus/load";
import { retrieveChunks } from "@/lib/corpus/retrieve";
import { llmNarrativeSchema, narrativeRequestSchema } from "@/lib/schema/narrative";
import { scoreAssessment } from "@/lib/scoring/score";

export const runtime = "nodejs";

const MAX_FREE_TEXT_CHARS = 4000;

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function truncateFreeText(
  freeText: Record<string, string> | undefined,
): Record<string, string> | undefined {
  if (!freeText) return undefined;
  let remaining = MAX_FREE_TEXT_CHARS;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(freeText)) {
    if (remaining <= 0) break;
    out[k] = v.slice(0, remaining);
    remaining -= out[k].length;
  }
  return out;
}

export async function POST(req: Request) {
  const started = Date.now();
  const { apiKey, model, enabled } = getOpenAIConfig();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = narrativeRequestSchema.safeParse(body);
  if (!parsed.success) {
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
    console.info(
      JSON.stringify({
        event: "narrative_rate_limited",
        assessmentId,
        ipHash: ip.slice(0, 8),
        latencyMs: Date.now() - started,
      }),
    );
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
    console.info(
      JSON.stringify({
        event: "narrative_cache_hit",
        assessmentId,
        latencyMs: Date.now() - started,
        narrativeStatus: cached.model.narrativeStatus,
      }),
    );
    return NextResponse.json({
      report: { ...cached, context: { ...cached.context, assessmentId, createdAt } },
      meta: { cached: true, remaining: limit.remaining, limit: limit.limit },
    });
  }

  const chunks = retrieveChunks(scoring);

  try {
    const { text, modelId } = await generateNarrative({
      assessmentId,
      input,
      scoring,
      chunks,
    });
    const json = normalizeLlmNarrative(extractJsonObject(text));
    const narrative = llmNarrativeSchema.safeParse(json);
    if (!narrative.success) {
      const report = buildScoresOnlyReport({
        assessmentId,
        createdAt,
        input,
        scoring,
        narrativeStatus: "schema_failed",
        modelId,
      });
      console.info(
        JSON.stringify({
          event: "narrative_schema_failed",
          assessmentId,
          latencyMs: Date.now() - started,
          modelId,
          issues: narrative.error.issues.slice(0, 8).map((i) => ({
            path: i.path.join("."),
            code: i.code,
            message: i.message,
          })),
          topKeys:
            json && typeof json === "object"
              ? Object.keys(json as object).slice(0, 12)
              : [],
        }),
      );
      return NextResponse.json({
        report,
        meta: { remaining: limit.remaining, limit: limit.limit },
      });
    }

    const report = mergeNarrativeReport({
      assessmentId,
      createdAt,
      input,
      scoring,
      narrative: narrative.data,
      modelId,
    });
    setCachedNarrative(cacheKey, report);
    console.info(
      JSON.stringify({
        event: "narrative_ok",
        assessmentId,
        latencyMs: Date.now() - started,
        modelId,
        chunkCount: chunks.length,
        corpusVersion: CORPUS_VERSION,
        promptVersion: PROMPT_VERSION,
      }),
    );
    return NextResponse.json({
      report,
      meta: { remaining: limit.remaining, limit: limit.limit },
    });
  } catch (err) {
    const report = buildScoresOnlyReport({
      assessmentId,
      createdAt,
      input,
      scoring,
      narrativeStatus: "unavailable",
      modelId: model,
    });
    console.info(
      JSON.stringify({
        event: "narrative_unavailable",
        assessmentId,
        latencyMs: Date.now() - started,
        error: err instanceof Error ? err.name : "unknown",
      }),
    );
    return NextResponse.json({
      report,
      meta: {
        remaining: limit.remaining,
        limit: limit.limit,
        error: "provider_error",
      },
    });
  }
}
