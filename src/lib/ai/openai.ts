import OpenAI from "openai";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/ai/prompt";
import type { CorpusChunk } from "@/lib/corpus/types";
import type { AssessmentInput, ScoringResult } from "@/lib/scoring/types";

export function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const enabled = process.env.AI_NARRATIVE_ENABLED !== "false";
  const maxOutputTokens = Number(process.env.AI_MAX_OUTPUT_TOKENS || 1500);
  return { apiKey, model, enabled, maxOutputTokens };
}

export async function generateNarrative(args: {
  assessmentId: string;
  input: AssessmentInput;
  scoring: ScoringResult;
  chunks: CorpusChunk[];
  repairHint?: string;
}): Promise<{ text: string; modelId: string }> {
  const { apiKey, model, maxOutputTokens } = getOpenAIConfig();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });

  const userContent = args.repairHint
    ? `${buildUserPrompt(args)}\n\n<<<REPAIR_INSTRUCTIONS>>>\n${args.repairHint}\n<<<END_REPAIR_INSTRUCTIONS>>>`
    : buildUserPrompt(args);

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    max_completion_tokens: maxOutputTokens,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) {
    throw new Error("Empty model response");
  }
  return { text, modelId: completion.model || model };
}

/** Safe, non-secret provider error summary for logs/meta. */
export function summarizeProviderError(err: unknown): string {
  if (!err || typeof err !== "object") return "provider_error";
  const e = err as {
    status?: number;
    code?: string;
    type?: string;
    message?: string;
    error?: { code?: string; type?: string; message?: string };
  };
  const code = e.code || e.error?.code || e.type || e.error?.type;
  const status = e.status;
  const message = (e.error?.message || e.message || "").slice(0, 160);
  return [status && `status_${status}`, code, message && "msg"]
    .filter(Boolean)
    .join(":") || "provider_error";
}
