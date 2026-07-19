export const MAX_BODY_BYTES = Number(
  process.env.AI_MAX_BODY_BYTES || 48_000,
);
export const MAX_FREE_TEXT_CHARS = Number(
  process.env.AI_MAX_FREE_TEXT_CHARS || 4_000,
);

export function truncateFreeText(
  freeText: Record<string, string> | undefined,
  maxChars = MAX_FREE_TEXT_CHARS,
): Record<string, string> | undefined {
  if (!freeText) return undefined;
  let remaining = maxChars;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(freeText)) {
    if (remaining <= 0) break;
    out[k] = v.slice(0, remaining);
    remaining -= out[k].length;
  }
  return out;
}

export async function readJsonBodyWithLimit(
  req: Request,
  maxBytes = MAX_BODY_BYTES,
): Promise<{ ok: true; body: unknown } | { ok: false; error: string }> {
  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    return { ok: false, error: "Request body too large" };
  }

  const reader = req.body?.getReader();
  if (!reader) {
    try {
      const body = await req.json();
      return { ok: true, body };
    } catch {
      return { ok: false, error: "Invalid JSON body" };
    }
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > maxBytes) {
        return { ok: false, error: "Request body too large" };
      }
      chunks.push(value);
    }
  }

  const merged = Buffer.concat(chunks.map((c) => Buffer.from(c)));
  try {
    return { ok: true, body: JSON.parse(merged.toString("utf8")) };
  } catch {
    return { ok: false, error: "Invalid JSON body" };
  }
}
