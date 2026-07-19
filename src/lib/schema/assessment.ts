import { z } from "zod";

export const ordinalChoiceSchema = z.enum(["A", "B", "C", "D"]);

export const assessmentContextSchema = z.object({
  systemName: z.string().min(1),
  jobToBeDone: z.string().min(1),
  audience: z.enum([
    "employees",
    "customers",
    "public",
    "mixed",
    "unclear",
  ]),
  interactionMode: z.enum([
    "assistive",
    "autonomous_tools",
    "batch",
    "unclear",
  ]),
  dataSensitivity: z.enum(["public", "internal", "pii", "regulated"]),
  blastRadius: z.enum([
    "low",
    "recoverable",
    "material",
    "safety_critical",
  ]),
  targetEnvironment: z.enum([
    "prototype",
    "pilot",
    "production",
    "unclear",
  ]),
});

export const assessmentInputSchema = z.object({
  context: assessmentContextSchema,
  answers: z.record(ordinalChoiceSchema),
  freeText: z.record(z.string()).optional(),
});

export type AssessmentInputParsed = z.infer<typeof assessmentInputSchema>;
