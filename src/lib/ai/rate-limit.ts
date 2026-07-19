type Bucket = { day: string; count: number };

const buckets = new Map<string, Bucket>();

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  limit: number;
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
    return { allowed: false, remaining: 0, limit };
  }
  bucket.count += 1;
  return { allowed: true, remaining: Math.max(0, limit - bucket.count), limit };
}
