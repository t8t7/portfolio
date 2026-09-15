import express from 'express';
import helmet from 'helmet';
import type { NextFunction, Request, Response } from 'express';
import { handleOpenProfile, handleOpenProject } from './openProfile';
import { createContactRouter } from './contactRoute';

const isProduction = process.env.NODE_ENV === 'production';

/** Optional allowlist: comma-separated hosts, e.g. "example.com,www.example.com". */
function allowedHosts(): Set<string> | null {
  const raw = process.env.PUBLIC_HOST?.trim();
  if (!raw) return null;
  return new Set(
    raw
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean),
  );
}

function createSecurityMiddleware() {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'object-src': ["'none'"],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
        'script-src': [
          "'self'",
          "'sha256-wGT3csR+uJQNRUaez4kfY4L+xotB4O9EVxSuOudQugY='",
          'https://www.clarity.ms',
        ],
        // Inline styles are required by Framer Motion / some CSS-in-JS runtime styles.
        'style-src': ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'img-src': ["'self'", 'data:', 'blob:', 'https://*.clarity.ms', 'https://c.bing.com'],
        'connect-src': ["'self'", 'https://*.clarity.ms', 'https://c.bing.com'],
        'worker-src': ["'self'", 'blob:'],
        ...(isProduction ? { 'upgrade-insecure-requests': [] } : {}),
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'deny' },
    noSniff: true,
    hsts: isProduction
      ? {
          maxAge: 15_552_000,
          includeSubDomains: true,
          preload: false,
        }
      : false,
  });
}

/** Opaque production errors — never leak stacks or paths to clients. */
export function safeErrorHandler(
  _error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (res.headersSent) return;

  res.status(500).json({
    ok: false,
    error: 'server_error',
  });
}

function isAllowedApiMethod(method: string): boolean {
  return method === 'GET' || method === 'HEAD' || method === 'POST';
}

export function createApp() {
  const app = express();
  const hosts = allowedHosts();

  app.disable('x-powered-by');
  app.disable('etag');

  // Only trust proxy when explicitly enabled (behind Nginx/Caddy).
  // Prevents X-Forwarded-For spoofing of rate-limit keys on direct exposure.
  if (process.env.TRUST_PROXY === '1' || process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
  }

  app.get('/healthz', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use((req, res, next) => {
    const configuredOrigin = process.env.PUBLIC_ORIGIN?.trim();
    if (!configuredOrigin || req.path === '/healthz') {
      next();
      return;
    }

    try {
      const origin = new URL(configuredOrigin);
      const requestHost = (req.headers.host || '').toLowerCase();
      if (req.protocol !== origin.protocol.replace(':', '') || requestHost !== origin.host.toLowerCase()) {
        res.redirect(308, `${origin.origin}${req.originalUrl}`);
        return;
      }
    } catch {
      // Invalid configuration must not make the application unavailable.
    }

    next();
  });

  app.use(createSecurityMiddleware());

  app.use((_req, res, next) => {
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    );
    next();
  });

  // Reject uncommon HTTP verbs early (TRACE/TRACK/etc.).
  app.use('/api', (req, res, next) => {
    if (!isAllowedApiMethod(req.method)) {
      res.status(405).json({ ok: false, error: 'method_not_allowed' });
      return;
    }
    next();
  });

  // Optional Host allowlist (defense against Host-header / virtual-host confusion).
  app.use('/api', (req, res, next) => {
    if (!hosts) {
      next();
      return;
    }

    const requestHost = (req.headers.host || '').split(',')[0]?.trim().toLowerCase();
    if (!requestHost || !hosts.has(requestHost)) {
      res.status(403).json({ ok: false, error: 'forbidden' });
      return;
    }

    next();
  });

  // Deny cross-origin browser API abuse (defense in depth; no public CORS).
  app.use('/api', (req, res, next) => {
    const origin = req.headers.origin;
    if (!origin) {
      next();
      return;
    }

    try {
      const originUrl = new URL(origin);
      const originHost = originUrl.host.toLowerCase();
      const requestHost = (req.headers.host || '').split(',')[0]?.trim().toLowerCase();

      if (requestHost && originHost === requestHost) {
        if (hosts && !hosts.has(originHost)) {
          res.status(403).json({ ok: false, error: 'forbidden' });
          return;
        }
        next();
        return;
      }
    } catch {
      /* invalid origin */
    }

    res.status(403).json({ ok: false, error: 'forbidden' });
  });

  app.use('/api/contact', createContactRouter());

  app.get('/api/open-profile', (req, res) => {
    const profile =
      typeof req.query.profile === 'string' ? req.query.profile : null;
    handleOpenProfile(req, res, profile);
  });

  app.get('/api/open-project', (req, res) => {
    const project =
      typeof req.query.project === 'string' ? req.query.project : null;
    handleOpenProject(req, res, project);
  });

  app.use(safeErrorHandler);

  return app;
}
