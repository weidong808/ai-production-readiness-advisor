/**
 * Best-effort redaction before model calls.
 * Not a guarantee — still treat free text as sensitive.
 */

const PATTERNS: { name: string; re: RegExp }[] = [
  {
    name: "openai_key",
    re: /\bsk-[A-Za-z0-9_-]{10,}\b/g,
  },
  {
    name: "aws_key",
    re: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    name: "generic_bearer",
    re: /\bBearer\s+[A-Za-z0-9._\-+/=]{20,}\b/gi,
  },
  {
    name: "pem_block",
    re: /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g,
  },
  {
    name: "connection_string_password",
    re: /(password|pwd|secret|api[_-]?key)\s*=\s*([^\s;'"]+)/gi,
  },
];

export function redactSecrets(text: string): {
  text: string;
  redactions: string[];
} {
  let out = text;
  const redactions: string[] = [];
  for (const { name, re } of PATTERNS) {
    const copy = new RegExp(re.source, re.flags);
    if (copy.test(out)) {
      redactions.push(name);
      out = out.replace(new RegExp(re.source, re.flags), `[REDACTED:${name}]`);
    }
  }
  return { text: out, redactions };
}

export function redactFreeTextMap(
  freeText: Record<string, string> | undefined,
): { freeText: Record<string, string> | undefined; redactions: string[] } {
  if (!freeText) return { freeText, redactions: [] };
  const out: Record<string, string> = {};
  const all: string[] = [];
  for (const [k, v] of Object.entries(freeText)) {
    const { text, redactions } = redactSecrets(v);
    out[k] = text;
    all.push(...redactions);
  }
  return { freeText: out, redactions: [...new Set(all)] };
}
