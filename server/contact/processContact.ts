import { randomUUID } from 'node:crypto';
import {
  isHoneypotTriggered,
  validateContactInput,
  type ContactInput,
} from '../../shared/contactValidation';
import { logContactMessage } from './logger';
import { sendAutoReply, sendOwnerNotification } from './mail';
import { sendTelegramNotification } from './telegram';
import type { ContactMessageContext } from './types';

export interface ProcessContactResult {
  ok: boolean;
  honeypot?: boolean;
  validationErrors?: ReturnType<typeof validateContactInput>['errors'];
  deliveryError?: boolean;
  errorMessage?: string;
}

function createId(): string {
  return randomUUID();
}

export async function processContactSubmission(options: {
  body: ContactInput;
  ip: string;
  userAgent: string;
}): Promise<ProcessContactResult> {
  // Honeypot: pretend success for bots, do not notify.
  if (isHoneypotTriggered(options.body)) {
    return { ok: true, honeypot: true };
  }

  const validation = validateContactInput(options.body);
  if (!validation.ok || !validation.data) {
    return {
      ok: false,
      validationErrors: validation.errors,
    };
  }

  const receivedAt = new Date();
  const ctx: ContactMessageContext = {
    ...validation.data,
    ip: options.ip,
    userAgent: options.userAgent || 'unknown',
    receivedAt,
  };

  const id = createId();
  const receivedAtIso = receivedAt.toISOString();

  // Persist first so the message is never lost if delivery fails.
  await logContactMessage({
    id,
    ...ctx,
    receivedAtIso,
  });

  const [ownerEmail, telegram, autoReply] = await Promise.allSettled([
    sendOwnerNotification(ctx),
    sendTelegramNotification(ctx),
    sendAutoReply(ctx),
  ]);

  const errors: string[] = [];
  const delivery = {
    ownerEmail: ownerEmail.status === 'fulfilled' ? 'ok' as const : 'failed' as const,
    telegram: telegram.status === 'fulfilled' ? 'ok' as const : 'failed' as const,
    autoReply: autoReply.status === 'fulfilled' ? 'ok' as const : 'failed' as const,
    errors,
  };

  if (ownerEmail.status === 'rejected') {
    errors.push('ownerEmail:failed');
  }
  if (telegram.status === 'rejected') {
    errors.push('telegram:failed');
  }
  if (autoReply.status === 'rejected') {
    errors.push('autoReply:failed');
  }

  await logContactMessage({
    id: `${id}:delivery`,
    ...ctx,
    receivedAtIso,
    delivery,
  });

  if (errors.length > 0) {
    return {
      ok: false,
      deliveryError: true,
      errorMessage: 'delivery_failed',
    };
  }

  return { ok: true };
}
