import bcrypt from 'bcryptjs';

type UserMap = Record<string, string>; // name -> bcrypt hash

function loadUsers(): UserMap {
  const raw = import.meta.env.AUTH_USERS as string | undefined;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as UserMap;
  } catch {}
  return {};
}

export function checkPassword(plain: string): string | null {
  const users = loadUsers();
  for (const [name, hash] of Object.entries(users)) {
    if (bcrypt.compareSync(plain, hash)) return name;
  }
  return null;
}
