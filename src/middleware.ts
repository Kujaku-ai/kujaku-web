import { defineMiddleware } from 'astro:middleware';
import { verify, SESSION_COOKIE } from '~/lib/session';

const PUBLIC_PATHS = new Set<string>(['/login']);
const PUBLIC_PREFIXES = ['/api/login', '/api/logout', '/brand/', '/_astro/'];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, locals, redirect } = context;
  if (isPublic(url.pathname)) return next();
  const raw = cookies.get(SESSION_COOKIE)?.value;
  const name = verify(raw);
  if (!name) return redirect('/login');
  (locals as { user?: string }).user = name;
  return next();
});
