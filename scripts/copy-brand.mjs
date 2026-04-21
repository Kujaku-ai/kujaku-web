import { cp, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const SRC = new URL('../vendor/kujaku-meta/brand/dist/', import.meta.url);
const DEST = new URL('../public/brand/', import.meta.url);

try {
  await stat(SRC);
} catch {
  console.error('[copy-brand] ERROR: vendor/kujaku-meta/brand/dist not found.');
  console.error('[copy-brand] Did you run: git submodule update --init --recursive ?');
  process.exit(1);
}

if (existsSync(DEST)) {
  await rm(DEST, { recursive: true, force: true });
}

await cp(SRC, DEST, { recursive: true });
console.log('[copy-brand] copied vendor/kujaku-meta/brand/dist -> public/brand');
