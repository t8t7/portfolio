import type { Request, Response, NextFunction, Router } from 'express';
import { Router as createRouter, json } from 'express';
import rateLimit from 'express-rate-limit';
import { processContactSubmission } from './contact/processContact';

function clientIp(req: Request): string {
  // When trust proxy is off, req.ip is the socket address (not spoofable via XFF).
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/** Reject prototype-pollution vectors before validation. */
function hasDangerousKeys(value: unknown, depth = 0): boolean {
  if (!value || typeof value !== 'object' || depth > 3) return false;

  for (const key of Object.keys(value as object)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return true;
    }
    if (hasDangerousKeys((value as Record<string, unknown>)[key], depth + 1)) {
      return true;
    }
  }

  return false;
}

export function createContactRouter(): Router {
  const router = createRouter();

  router.use(
    json({
      limit: '20kb',
      type: ['application/json'],
    }),
  );

  router.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      limit: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        ok: false,
        error: 'rate_limited',
      },
    }),
  );

  router.post('/', async (req: Request, res: Response) => {
    try {
      if (hasDangerousKeys(req.body)) {
        res.status(400).json({
          ok: false,
          error: 'validation_failed',
        });
        return;
      }

      const result = await processContactSubmission({
        body: req.body ?? {},
        ip: clientIp(req),
        userAgent: String(req.headers['user-agent'] || 'unknown').slice(0, 512),
      });

      if (result.honeypot) {
        res.status(200).json({ ok: true });
        return;
      }

      if (result.validationErrors) {
        res.status(400).json({
          ok: false,
          error: 'validation_failed',
          errors: result.validationErrors,
        });
        return;
      }

      if (result.deliveryError) {
        res.status(502).json({
          ok: false,
          error: 'delivery_failed',
        });
        return;
      }

      if (!result.ok) {
        res.status(500).json({
          ok: false,
          error: 'server_error',
        });
        return;
      }

      res.status(200).json({ ok: true });
    } catch {
      res.status(500).json({
        ok: false,
        error: 'server_error',
      });
    }
  });

  router.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (!error || typeof error !== 'object') {
      next(error);
      return;
    }

    const err = error as { type?: string; status?: number; statusCode?: number };
    if (err.type === 'entity.too.large' || err.status === 413 || err.statusCode === 413) {
      res.status(413).json({
        ok: false,
        error: 'payload_too_large',
      });
      return;
    }

    if (err.type === 'entity.parse.failed') {
      res.status(400).json({
        ok: false,
        error: 'invalid_json',
      });
      return;
    }

    res.status(500).json({
      ok: false,
      error: 'server_error',
    });
  });

  return router;
}
