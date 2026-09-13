import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mailMocks = vi.hoisted(() => ({
  sendOwnerNotification: vi.fn(async () => undefined),
  sendAutoReply: vi.fn(async () => undefined),
}));

const telegramMocks = vi.hoisted(() => ({
  sendTelegramNotification: vi.fn(async () => undefined),
}));

const loggerMocks = vi.hoisted(() => ({
  logContactMessage: vi.fn(async () => undefined),
}));

vi.mock('../../server/contact/mail', () => ({
  sendOwnerNotification: mailMocks.sendOwnerNotification,
  sendAutoReply: mailMocks.sendAutoReply,
}));

vi.mock('../../server/contact/telegram', () => ({
  sendTelegramNotification: telegramMocks.sendTelegramNotification,
}));

vi.mock('../../server/contact/logger', () => ({
  logContactMessage: loggerMocks.logContactMessage,
}));

import { createApp } from '../../server/app';

const validContactPayload = {
  name: 'Anton Fedotov',
  email: 'anton@example.com',
  company: 'Avalon',
  message: 'Hello, I would like to discuss a backend role with you.',
  website: '',
};

function contactRequest(app: ReturnType<typeof createApp>) {
  return request(app).post('/api/contact').set('Content-Type', 'application/json');
}

function resetDeliveryMocks() {
  mailMocks.sendOwnerNotification.mockReset();
  mailMocks.sendAutoReply.mockReset();
  telegramMocks.sendTelegramNotification.mockReset();
  loggerMocks.logContactMessage.mockReset();
  mailMocks.sendOwnerNotification.mockResolvedValue(undefined);
  mailMocks.sendAutoReply.mockResolvedValue(undefined);
  telegramMocks.sendTelegramNotification.mockResolvedValue(undefined);
  loggerMocks.logContactMessage.mockResolvedValue(undefined);
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    resetDeliveryMocks();
  });

  it('accepts a valid payload and triggers email + telegram delivery', async () => {
    const app = createApp();
    const response = await contactRequest(app).send(validContactPayload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(mailMocks.sendOwnerNotification).toHaveBeenCalledTimes(1);
    expect(mailMocks.sendAutoReply).toHaveBeenCalledTimes(1);
    expect(telegramMocks.sendTelegramNotification).toHaveBeenCalledTimes(1);
    expect(loggerMocks.logContactMessage).toHaveBeenCalled();

    const ownerCtx = mailMocks.sendOwnerNotification.mock.calls[0]?.[0] as {
      email: string;
      name: string;
    };
    expect(ownerCtx.email).toBe(validContactPayload.email);
    expect(ownerCtx.name).toBe(validContactPayload.name);
  });

  it('rejects invalid email', async () => {
    const app = createApp();
    const response = await contactRequest(app).send({
      ...validContactPayload,
      email: 'not-an-email',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('validation_failed');
    expect(response.body.errors.email).toBe('emailInvalid');
    expect(mailMocks.sendOwnerNotification).not.toHaveBeenCalled();
    expect(telegramMocks.sendTelegramNotification).not.toHaveBeenCalled();
  });

  it('rejects empty required fields', async () => {
    const app = createApp();
    const response = await contactRequest(app).send({
      name: '',
      email: '',
      message: '',
      website: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('validation_failed');
    expect(response.body.errors.name).toBe('required');
    expect(response.body.errors.email).toBe('required');
    expect(response.body.errors.message).toBe('required');
  });

  it('rejects XSS payloads', async () => {
    const app = createApp();
    const response = await contactRequest(app).send({
      ...validContactPayload,
      name: '<script>alert(1)</script>',
      message: '<img src=x onerror=alert(1)> hello world',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('validation_failed');
    expect(mailMocks.sendOwnerNotification).not.toHaveBeenCalled();
  });

  it('rejects SQL injection payloads', async () => {
    const app = createApp();
    const response = await contactRequest(app).send({
      ...validContactPayload,
      message: "' OR 1=1 -- drop table users attack",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('validation_failed');
    expect(response.body.errors.message).toBe('unsafe');
  });

  it('rejects email header injection in name', async () => {
    const app = createApp();
    const response = await contactRequest(app).send({
      ...validContactPayload,
      name: 'Anton\r\nBcc: evil@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('validation_failed');
    expect(response.body.errors.name).toBe('unsafe');
  });

  it('rejects prototype pollution keys', async () => {
    const app = createApp();
    const response = await contactRequest(app).send(
      '{"name":"Anton Fedotov","email":"anton@example.com","company":"Avalon","message":"Hello, I would like to discuss a backend role with you.","website":"","__proto__":{"admin":true},"constructor":{"prototype":{"admin":true}}}',
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('validation_failed');
    expect(mailMocks.sendOwnerNotification).not.toHaveBeenCalled();
  });

  it('rejects oversized messages', async () => {
    const app = createApp();
    const response = await contactRequest(app).send({
      ...validContactPayload,
      message: 'A'.repeat(2001),
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('validation_failed');
    expect(response.body.errors.message).toBe('messageMax');
  });

  it('returns 429 after rate limit is exceeded', async () => {
    const app = createApp();

    for (let i = 0; i < 5; i += 1) {
      const response = await contactRequest(app).send(validContactPayload);
      expect(response.status).toBe(200);
    }

    const limited = await contactRequest(app).send(validContactPayload);
    expect(limited.status).toBe(429);
    expect(limited.body.error).toBe('rate_limited');
  });

  it('rejects requests with a foreign Origin', async () => {
    const app = createApp();
    const response = await contactRequest(app)
      .set('Origin', 'https://evil.example')
      .set('Host', 'localhost:4173')
      .send(validContactPayload);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('forbidden');
    expect(mailMocks.sendOwnerNotification).not.toHaveBeenCalled();
  });

  it('rejects forbidden HTTP methods', async () => {
    const app = createApp();
    const response = await request(app)
      .put('/api/contact')
      .set('Content-Type', 'application/json')
      .send(validContactPayload);

    expect(response.status).toBe(405);
    expect(response.body.error).toBe('method_not_allowed');
  });

  it('surfaces delivery_failed when Telegram/Email mocks reject', async () => {
    const app = createApp();
    mailMocks.sendOwnerNotification.mockRejectedValueOnce(new Error('smtp down'));
    telegramMocks.sendTelegramNotification.mockRejectedValueOnce(
      new Error('telegram down'),
    );
    mailMocks.sendAutoReply.mockRejectedValueOnce(new Error('smtp down'));

    const response = await contactRequest(app).send(validContactPayload);

    expect(response.status).toBe(502);
    expect(response.body.error).toBe('delivery_failed');
    expect(mailMocks.sendOwnerNotification).toHaveBeenCalled();
    expect(telegramMocks.sendTelegramNotification).toHaveBeenCalled();
  });
});

describe('GET /api/open-project', () => {
  it('redirects GoodPapa through the server-side project allowlist', async () => {
    const previousUrl = process.env.PROJECT_GOODPAPA;
    process.env.PROJECT_GOODPAPA = 'https://goodpapa12.com';

    try {
      const response = await request(createApp()).get('/api/open-project?project=goodpapa');

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('https://goodpapa12.com');
    } finally {
      if (previousUrl === undefined) {
        delete process.env.PROJECT_GOODPAPA;
      } else {
        process.env.PROJECT_GOODPAPA = previousUrl;
      }
    }
  });

  it('rejects unknown project keys', async () => {
    const response = await request(createApp()).get('/api/open-project?project=unknown');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ ok: false, error: 'not_found' });
  });
});
