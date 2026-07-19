type Bucket = { day: string; count: number };

/**
 * Best-effort per-IP daily counter stored in process memory.
 *
 * Under Vercel serverless this Map is **not** durable: each isolate has its own
 * counter and cold starts reset it. Do not treat the default of 10 as a hard
 * global daily quota — pair with cache + max output tokens for cost control.
 * A durable store (e.g. Vercel KV) can replace this later behind the same API.
 */
const buckets = new Map<string, Bucket>();

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  limit: number;
  mode: "best_effort_in_memory";
} {
  const limit = Number(process.env.AI_RATE_LIMIT_PER_IP_PER_DAY || 10);
  const day = todayKey();
  const key = `${ip}:${day}`;
  const current = buckets.get(key);
  if (!current || current.day !== day) {
    buckets.set(key, { day, count: 0 });
  }
  const bucket = buckets.get(key)!;
  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      mode: "best_effort_in_memory",
    };
  }
  bucket.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - bucket.count),
    limit,
    mode: "best_effort_in_memory",
  };
}
