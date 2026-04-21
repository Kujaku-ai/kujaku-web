type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX = 3;

export function tooMany(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.resetAt < now) {
    buckets.set(ip, { count: 0, resetAt: now + WINDOW_MS });
    return false;
  }
  return b.count >= MAX;
}

export function recordFail(ip: string): void {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  b.count += 1;
}

export function clear(ip: string): void {
  buckets.delete(ip);
}
