function nowMountain(): string {
  // Render timestamps in America/Denver (per spec: not UTC).
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  });
  return fmt.format(new Date());
}

export async function ping(message: string): Promise<void> {
  const url = import.meta.env.DISCORD_WEBHOOK_URL as string | undefined;
  if (!url) return; // optional — silent no-op if unset
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });
  } catch {
    // fail silently; auth flow should not be blocked by a down webhook
  }
}

export function loginMessage(name: string): string {
  return `${name} logged in — ${nowMountain()}`;
}

export function failedLoginMessage(ip: string): string {
  return `failed login attempt from ${ip} — ${nowMountain()}`;
}
