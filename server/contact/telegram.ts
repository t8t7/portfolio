import { formatDateTime, type ContactMessageContext } from './types';

const TELEGRAM_TIMEOUT_MS = 10_000;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error('Notification service is not configured');
  }
  return value;
}

function escapeTelegram(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/** Chat ID must be numeric Telegram id (optionally negative for groups). */
function sanitizeChatId(value: string): string {
  const trimmed = value.trim();
  if (!/^-?\d{1,20}$/.test(trimmed)) {
    throw new Error('Notification service is not configured');
  }
  return trimmed;
}

/** Bot tokens are always digits:secret — reject unexpected shapes. */
function sanitizeBotToken(value: string): string {
  const trimmed = value.trim();
  if (!/^\d{6,12}:[A-Za-z0-9_-]{30,}$/.test(trimmed)) {
    throw new Error('Notification service is not configured');
  }
  return trimmed;
}

export async function sendTelegramNotification(ctx: ContactMessageContext): Promise<void> {
  try {
    const token = sanitizeBotToken(requireEnv('TELEGRAM_BOT_TOKEN'));
    const chatId = sanitizeChatId(requireEnv('TELEGRAM_CHAT_ID'));
    const { full } = formatDateTime(ctx.receivedAt);

    const text = [
      '📩 <b>Новое сообщение с портфолио</b>',
      '',
      `👤 <b>Имя:</b> ${escapeTelegram(ctx.name)}`,
      `📧 <b>Email:</b> ${escapeTelegram(ctx.email)}`,
      `🏢 <b>Компания:</b> ${escapeTelegram(ctx.company || '—')}`,
      '',
      `💬 <b>Сообщение:</b>`,
      escapeTelegram(ctx.message),
      '',
      `🌍 <b>IP:</b> ${escapeTelegram(ctx.ip)}`,
      `🖥 <b>User-Agent:</b> ${escapeTelegram(ctx.userAgent)}`,
      `🕒 <b>Дата и время:</b> ${escapeTelegram(full)}`,
    ].join('\n');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw new Error('Telegram delivery failed');
    }
  } catch {
    throw new Error('Telegram delivery failed');
  }
}
