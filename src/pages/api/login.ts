import type { APIRoute } from 'astro';
import { checkPassword } from '~/lib/auth';
import { sign, SESSION_COOKIE, SESSION_MAX_AGE } from '~/lib/session';
import { tooMany, recordFail, clear } from '~/lib/ratelimit';
import { ping, loginMessage, failedLoginMessage } from '~/lib/discord';

export const POST: APIRoute = async ({ request, cookies, clientAddress, redirect }) => {
  const ip = clientAddress || 'unknown';
  if (tooMany(ip)) {
    return new Response('Too many attempts. Try again later.', { status: 429 });
  }

  const form = await request.formData();
  const password = (form.get('password') ?? '').toString();

  const name = checkPassword(password);
  if (!name) {
    recordFail(ip);
    await ping(failedLoginMessage(ip));
    const url = new URL(request.url);
    url.pathname = '/login';
    url.searchParams.set('e', '1');
    return redirect(url.pathname + url.search, 303);
  }

  clear(ip);
  cookies.set(SESSION_COOKIE, sign(name), {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  await ping(loginMessage(name));
  return redirect('/', 303);
};
