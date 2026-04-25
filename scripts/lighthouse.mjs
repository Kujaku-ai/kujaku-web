#!/usr/bin/env node
/**
 * Lighthouse runner for the asset-page polish loop.
 *
 * Hits 3 representative routes × 2 form-factors (desktop + mobile)
 * = 6 reports. Auth-walled routes need a session cookie — minted
 * from .env's SESSION_SECRET using the same scheme as src/lib/session.ts.
 *
 * Usage:
 *   npm run lighthouse:asset            # default: dev server on :4321
 *   BASE_URL=http://localhost:3000 npm run lighthouse:asset
 *
 * Output: /tmp/lighthouse-{route-slug}-{form-factor}.html and a
 * /tmp/lighthouse-summary.json with the score grid (per route ×
 * form-factor × category).
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';
const OUT_DIR = process.env.LIGHTHOUSE_OUT_DIR || '/tmp';

const ROUTES = [
  { slug: 'overview-btc',  path: '/crypto/btc/overview' },
  { slug: 'charting-btc',  path: '/crypto/btc/charting' },
  { slug: 'news-ionq',     path: '/qc/ionq/news' },
];
const FORM_FACTORS = ['desktop', 'mobile'];

function readEnv(key) {
  const env = fs.readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith(key + '='));
  if (!env) throw new Error(`${key} missing from .env`);
  return env.slice(key.length + 1).trim();
}

function mintCookie(name = 'devtest', ttlMs = 3600 * 1000) {
  const secret = readEnv('SESSION_SECRET');
  const expires = Date.now() + ttlMs;
  const payload = `${name}:${expires}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}:${sig}`;
}

function runLighthouse({ url, outPath, formFactor, cookie, headersPath }) {
  // Lighthouse CLI invocation. --quiet suppresses progress noise.
  // --output html + --output-path lets us collect a portable report.
  // --extra-headers points at a JSON file (passing inline curly-brace
  // JSON breaks under Windows cmd.exe quoting). --form-factor controls
  // desktop-vs-mobile emulation (mobile = throttled CPU + small
  // viewport, desktop = unthrottled + 1350×940).
  const args = [
    'lighthouse',
    url,
    '--quiet',
    '--chrome-flags=--headless=new',
    `--form-factor=${formFactor}`,
    `--screenEmulation.disabled=${formFactor === 'desktop'}`,
    '--output=json',
    '--output=html',
    `--output-path=${outPath}`,
    `--extra-headers=${headersPath}`,
    '--only-categories=performance,accessibility,best-practices,seo',
  ];

  const res = spawnSync('npx', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });
  if (res.status !== 0) {
    process.stderr.write(`[lighthouse] FAILED ${url} (${formFactor})\n`);
    if (res.stderr) process.stderr.write(res.stderr.slice(0, 800) + '\n');
    return null;
  }
  // Read the JSON sidecar (lighthouse writes both .html and .report.json
  // when given --output=json + --output=html).
  const jsonPath = outPath.replace(/\.html$/, '.report.json');
  if (!fs.existsSync(jsonPath)) return null;
  const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  return {
    performance:    Math.round((report.categories.performance.score    || 0) * 100),
    accessibility:  Math.round((report.categories.accessibility.score  || 0) * 100),
    bestPractices:  Math.round((report.categories['best-practices'].score || 0) * 100),
    seo:            Math.round((report.categories.seo.score            || 0) * 100),
  };
}

function main() {
  const cookie = mintCookie();

  // Write the auth headers to a temp file once; lighthouse reads it
  // for every invocation. Inline JSON breaks under Windows cmd.exe
  // quoting, so the file is the portable path.
  const headersPath = path.join(OUT_DIR, 'lighthouse-auth.json');
  fs.writeFileSync(headersPath, JSON.stringify({ Cookie: `kj_session=${cookie}` }));

  const summary = {};

  for (const route of ROUTES) {
    summary[route.slug] = {};
    for (const ff of FORM_FACTORS) {
      const fileBase = `lighthouse-${route.slug}-${ff}`;
      const outHtml = path.join(OUT_DIR, fileBase + '.html');
      const url = BASE_URL + route.path;
      process.stderr.write(`[lighthouse] ${url} (${ff}) → ${outHtml}\n`);
      const scores = runLighthouse({
        url, outPath: outHtml, formFactor: ff, cookie, headersPath,
      });
      summary[route.slug][ff] = scores;
    }
  }

  const summaryPath = path.join(OUT_DIR, 'lighthouse-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  process.stdout.write('\n=== LIGHTHOUSE SCORES ===\n');
  for (const [slug, byFf] of Object.entries(summary)) {
    process.stdout.write(`\n${slug}:\n`);
    for (const [ff, scores] of Object.entries(byFf)) {
      if (!scores) {
        process.stdout.write(`  ${ff.padEnd(8)} FAILED\n`);
        continue;
      }
      process.stdout.write(
        `  ${ff.padEnd(8)} perf=${scores.performance}  a11y=${scores.accessibility}  best=${scores.bestPractices}  seo=${scores.seo}\n`,
      );
    }
  }
  process.stdout.write(`\nSummary written to ${summaryPath}\n`);
}

main();
