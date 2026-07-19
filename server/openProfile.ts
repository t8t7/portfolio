import type { IncomingMessage, ServerResponse } from 'node:http';
import { getProfileUrl, isProfileKey } from './profileUrls';
import { getProjectUrl, isProjectRedirectKey } from './projectUrls';

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

/** Only allow http(s) absolute URLs from server env — blocks javascript: and other schemes. */
function isSafeRedirectUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function redirect(res: ServerResponse, location: string) {
  if (!isSafeRedirectUrl(location)) {
    sendJson(res, 500, { ok: false, error: 'server_error' });
    return;
  }

  res.statusCode = 302;
  res.setHeader('Location', location);
  res.setHeader('Cache-Control', 'no-store');
  res.end();
}

/**
 * GET /api/open-profile?profile=github|hh|telegram
 */
export function handleOpenProfile(
  _req: IncomingMessage,
  res: ServerResponse,
  profileParam: string | null,
) {
  if (!isProfileKey(profileParam)) {
    sendJson(res, 404, { ok: false, error: 'not_found' });
    return;
  }

  const destination = getProfileUrl(profileParam);
  if (!destination) {
    sendJson(res, 404, { ok: false, error: 'not_found' });
    return;
  }

  redirect(res, destination);
}

/**
 * GET /api/open-project?project=door-soft
 */
export function handleOpenProject(
  _req: IncomingMessage,
  res: ServerResponse,
  projectParam: string | null,
) {
  if (!isProjectRedirectKey(projectParam)) {
    sendJson(res, 404, { ok: false, error: 'not_found' });
    return;
  }

  const destination = getProjectUrl(projectParam);
  if (!destination) {
    sendJson(res, 404, { ok: false, error: 'not_found' });
    return;
  }

  redirect(res, destination);
}
