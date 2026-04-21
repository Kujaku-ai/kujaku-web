import crypto from 'node:crypto';

const COOKIE_NAME = 'kj_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  const s = import.meta.env.SESSION_SECRET;
  if (!s) throw new Error('SESSION_SECRET is not set');
  return s as string;
}

export function sign(name: string): string {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${name}:${expires}`;
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  return `${payload}:${sig}`;
}

export function verify(cookie: string | undefined): string | null {
  if (!cookie) return null;
  const parts = cookie.split(':');
  if (parts.length !== 3) return null;
  const [name, expiresStr, sig] = parts;
  const expires = Number.parseInt(expiresStr, 10);
  if (!Number.isFinite(expires) || Date.now() > expires) return null;
  const expected = crypto.createHmac('sha256', secret()).update(`${name}:${expires}`).digest('hex');
  // constant-time compare
  if (sig.length !== expected.length) return null;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return null;
  } catch {
    return null;
  }
  return name;
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
