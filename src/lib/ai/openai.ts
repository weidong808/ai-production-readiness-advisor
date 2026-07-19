import OpenAI from "openai";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/ai/prompt";
import type { CorpusChunk } from "@/lib/corpus/types";
import type { AssessmentInput, ScoringResult } from "@/lib/scoring/types";

export function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
  const enabled = process.env.AI_NARRATIVE_ENABLED !== "false";
  const maxOutputTokens = Number(process.env.AI_MAX_OUTPUT_TOKENS || 1500);
  return { apiKey, model, enabled, maxOutputTokens };
}

export async function generateNarrative(args: {
  assessmentId: string;
  input: AssessmentInput;
  scoring: ScoringResult;
  chunks: CorpusChunk[];
}): Promise<{ text: string; modelId: string }> {
  const { apiKey, model, maxOutputTokens } = getOpenAIConfig();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    max_tokens: maxOutputTokens,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: buildUserPrompt(args),
      },
    ],
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) {
    throw new Error("Empty model response");
  }
  return { text, modelId: completion.model || model };
}
