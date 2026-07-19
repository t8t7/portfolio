import { appendFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { ContactMessageContext } from './types';

const LOG_DIR = resolve(process.cwd(), 'server', 'logs');
const JSON_LOG = resolve(LOG_DIR, 'messages.jsonl');
const TEXT_LOG = resolve(LOG_DIR, 'contact.log');

export interface ContactLogEntry extends ContactMessageContext {
  id: string;
  receivedAtIso: string;
  delivery?: {
    ownerEmail: 'ok' | 'failed';
    telegram: 'ok' | 'failed';
    autoReply: 'ok' | 'failed';
    errors?: string[];
  };
}

async function ensureLogDir() {
  await mkdir(LOG_DIR, { recursive: true });
}

export async function logContactMessage(
  entry: Omit<ContactLogEntry, 'receivedAt'> & { receivedAt: Date },
): Promise<void> {
  await ensureLogDir();

  const serializable = {
    id: entry.id,
    name: entry.name,
    email: entry.email,
    company: entry.company,
    message: entry.message,
    ip: entry.ip,
    userAgent: entry.userAgent,
    receivedAt: entry.receivedAtIso,
    delivery: entry.delivery,
  };

  await appendFile(JSON_LOG, `${JSON.stringify(serializable)}\n`, 'utf8');

  const text = [
    `[${entry.receivedAtIso}] id=${entry.id}`,
    `name=${entry.name}`,
    `email=${entry.email}`,
    `company=${entry.company || '-'}`,
    `ip=${entry.ip}`,
    `ua=${entry.userAgent}`,
    `message=${entry.message.replaceAll('\n', ' ')}`,
    entry.delivery
      ? `delivery owner=${entry.delivery.ownerEmail} telegram=${entry.delivery.telegram} autoReply=${entry.delivery.autoReply}`
      : 'delivery=pending',
    '---',
  ].join('\n');

  await appendFile(TEXT_LOG, `${text}\n`, 'utf8');
}
