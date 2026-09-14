import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, relative, isAbsolute } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { createApp } from './app';
import { canonicalPathRedirect, pageHtmlPath } from './seoRouting';

loadEnv({ path: resolve(process.cwd(), '.env') });

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const PORT = Number(process.env.PORT || 4173);
const DIST = resolve(process.cwd(), 'dist');

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};

const BLOCKED_EXTENSIONS = new Set([
  '.env',
  '.log',
  '.map',
  '.ts',
  '.tsx',
  '.md',
  '.jsonl',
  '.bak',
  '.old',
  '.sql',
  '.pem',
  '.key',
  '.crt',
  '.p12',
  '.pfx',
  '.config',
]);

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const info = await stat(filePath);
    return info.isFile();
  } catch {
    return false;
  }
}

function isSafeDistPath(candidate: string): boolean {
  const rel = relative(DIST, candidate);
  if (!rel || rel === '') return true;
  if (isAbsolute(rel)) return false;
  return !rel.split(/[/\\]/).includes('..');
}

function setCacheHeaders(
  res: import('express').Response,
  pathname: string,
  ext: string,
) {
  if (ext === '.html' || pathname === '/' || pathname === '/index.html') {
    res.setHeader('Cache-Control', 'no-cache');
    return;
  }

  // Vite hashed assets: /assets/name-HASH.ext
  if (/\/assets\/[^/]+-[A-Za-z0-9_-]{6,}\./.test(pathname)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=86400');
}

async function serveStatic(
  pathname: string,
  res: import('express').Response,
) {
  let decoded = pathname.split('?')[0] || '/';
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    res.status(400).json({ ok: false, error: 'bad_request' });
    return;
  }

  const pagePath = pageHtmlPath(decoded);
  const safePath = pagePath ? `/${pagePath}` : decoded;
  const normalized = safePath.replace(/\\/g, '/');

  if (
    normalized.includes('\0') ||
    normalized.includes('..') ||
    /\/\./.test(normalized) ||
    normalized.toLowerCase().includes('.env')
  ) {
    res.status(403).json({ ok: false, error: 'forbidden' });
    return;
  }

  const ext = extname(normalized).toLowerCase();
  if (BLOCKED_EXTENSIONS.has(ext)) {
    res.status(404).end('Not found');
    return;
  }

  const filePath = resolve(DIST, normalized.replace(/^\/+/, ''));

  if (!isSafeDistPath(filePath)) {
    res.status(403).json({ ok: false, error: 'forbidden' });
    return;
  }

  if (await fileExists(filePath)) {
    res.status(200);
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    setCacheHeaders(res, normalized, ext);
    createReadStream(filePath).pipe(res);
    return;
  }

  res.status(404).type('text/plain').end('Not found');
}

const app = createApp();

app.use(async (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    next();
    return;
  }

  if (req.path.startsWith('/api/')) {
    next();
    return;
  }

  const redirectPath = canonicalPathRedirect(req.path);
  if (redirectPath) {
    const queryIndex = req.originalUrl.indexOf('?');
    const query = queryIndex >= 0 ? req.originalUrl.slice(queryIndex) : '';
    res.redirect(308, `${redirectPath}${query}`);
    return;
  }

  await serveStatic(req.path, res);
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'not_found' });
});

const server = app.listen(PORT, () => {
  process.stdout.write(`Portfolio server listening on port ${PORT}\n`);
});

// Mitigate Slowloris / hung sockets (Node HTTP server timeouts).
server.headersTimeout = 15_000;
server.requestTimeout = 30_000;
server.keepAliveTimeout = 5_000;
server.maxHeadersCount = 50;
