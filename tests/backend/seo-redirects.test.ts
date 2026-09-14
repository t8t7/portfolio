import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { createApp } from '../../server/app';

const originalPublicOrigin = process.env.PUBLIC_ORIGIN;
const originalTrustProxy = process.env.TRUST_PROXY;

afterEach(() => {
  if (originalPublicOrigin === undefined) {
    delete process.env.PUBLIC_ORIGIN;
  } else {
    process.env.PUBLIC_ORIGIN = originalPublicOrigin;
  }

  if (originalTrustProxy === undefined) {
    delete process.env.TRUST_PROXY;
  } else {
    process.env.TRUST_PROXY = originalTrustProxy;
  }
});

describe('public origin redirects', () => {
  it('redirects www and HTTP requests to the configured HTTPS apex origin', async () => {
    process.env.PUBLIC_ORIGIN = 'https://antonfedotov.com';
    process.env.TRUST_PROXY = 'true';
    const app = createApp();

    const wwwResponse = await request(app)
      .get('/projects/sandbox?source=test')
      .set('Host', 'www.antonfedotov.com')
      .set('X-Forwarded-Proto', 'https');
    expect(wwwResponse.status).toBe(308);
    expect(wwwResponse.headers.location).toBe(
      'https://antonfedotov.com/projects/sandbox?source=test',
    );

    const httpResponse = await request(app)
      .get('/en/')
      .set('Host', 'antonfedotov.com')
      .set('X-Forwarded-Proto', 'http');
    expect(httpResponse.status).toBe(308);
    expect(httpResponse.headers.location).toBe('https://antonfedotov.com/en/');
  });

  it('keeps the health check reachable without a canonical redirect', async () => {
    process.env.PUBLIC_ORIGIN = 'https://antonfedotov.com';
    const response = await request(createApp())
      .get('/healthz')
      .set('Host', 'localhost:3000');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});
