import nodemailer from 'nodemailer';
import { escapeHtml, formatDateTime, type ContactMessageContext } from './types';

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error('Email service is not configured');
  }
  return value;
}

/** Strip CR/LF to prevent email header injection. */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n\0]/g, '').trim();
}

function getSmtpConfig() {
  const host = requireEnv('YANDEX_SMTP_HOST');
  const port = Number(process.env.YANDEX_SMTP_PORT || 465);
  const secure =
    String(process.env.YANDEX_SMTP_SECURE ?? 'true').toLowerCase() !== 'false';
  const user = requireEnv('YANDEX_EMAIL');
  const pass = requireEnv('YANDEX_PASSWORD');

  return { host, port, secure, user, pass };
}

function createTransport() {
  const { host, port, secure, user, pass } = getSmtpConfig();

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    tls: {
      minVersion: 'TLSv1.2',
    },
  });
}

function ownerEmailHtml(ctx: ContactMessageContext): string {
  const { date, time } = formatDateTime(ctx.receivedAt);
  const company = ctx.company || '—';

  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8" /><title>Новое сообщение с портфолио</title></head>
<body style="margin:0;padding:0;background:#0e1013;font-family:Segoe UI,Arial,sans-serif;color:#e8e6e3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0e1013;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:640px;background:#161a1f;border:1px solid #2a3038;border-radius:4px;">
        <tr><td style="padding:28px 28px 12px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#c2a46b;">Portfolio</p>
          <h1 style="margin:12px 0 0;font-size:22px;font-weight:600;color:#f3f1ee;">Новое сообщение с портфолио</h1>
        </td></tr>
        <tr><td style="padding:8px 28px 28px;">
          <table role="presentation" width="100%" style="border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#9aa3ad;width:140px;">Имя</td><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#f3f1ee;">${escapeHtml(ctx.name)}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#9aa3ad;">Email</td><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#f3f1ee;"><a href="mailto:${escapeHtml(ctx.email)}" style="color:#c2a46b;text-decoration:none;">${escapeHtml(ctx.email)}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#9aa3ad;">Компания</td><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#f3f1ee;">${escapeHtml(company)}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#9aa3ad;">Дата</td><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#f3f1ee;">${escapeHtml(date)}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#9aa3ad;">Время</td><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#f3f1ee;">${escapeHtml(time)} (МСК)</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#9aa3ad;">IP</td><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#f3f1ee;">${escapeHtml(ctx.ip)}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#9aa3ad;vertical-align:top;">User-Agent</td><td style="padding:10px 0;border-bottom:1px solid #2a3038;color:#f3f1ee;word-break:break-word;">${escapeHtml(ctx.userAgent)}</td></tr>
          </table>
          <p style="margin:24px 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#c2a46b;">Сообщение</p>
          <div style="padding:16px;background:#0e1013;border:1px solid #2a3038;border-radius:4px;color:#e8e6e3;line-height:1.6;white-space:pre-wrap;">${escapeHtml(ctx.message)}</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function autoReplyHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8" /><title>Спасибо за ваше сообщение</title></head>
<body style="margin:0;padding:0;background:#0e1013;font-family:Segoe UI,Arial,sans-serif;color:#e8e6e3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0e1013;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:640px;background:#161a1f;border:1px solid #2a3038;border-radius:4px;">
        <tr><td style="padding:28px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#c2a46b;">Anton Fedotov</p>
          <h1 style="margin:12px 0 20px;font-size:22px;font-weight:600;color:#f3f1ee;">Спасибо за ваше сообщение</h1>
          <p style="margin:0 0 14px;line-height:1.7;color:#e8e6e3;">Здравствуйте${name ? `, ${escapeHtml(name)}` : ''}!</p>
          <p style="margin:0 0 14px;line-height:1.7;color:#e8e6e3;">Спасибо за ваше сообщение и интерес к моему портфолио.</p>
          <p style="margin:0 0 14px;line-height:1.7;color:#e8e6e3;">Ваше обращение успешно получено.</p>
          <p style="margin:0 0 14px;line-height:1.7;color:#e8e6e3;">Я обязательно ознакомлюсь с ним.</p>
          <p style="margin:0 0 22px;line-height:1.7;color:#e8e6e3;">Обычно отвечаю в течение 1–2 рабочих дней.</p>
          <p style="margin:0;line-height:1.7;color:#f3f1ee;">С уважением,</p>
          <p style="margin:4px 0 0;line-height:1.7;color:#f3f1ee;">Антон Федотов</p>
          <p style="margin:4px 0 0;line-height:1.7;color:#c2a46b;">Python Backend Developer</p>
          <p style="margin:28px 0 0;font-size:12px;line-height:1.6;color:#9aa3ad;">Это письмо сформировано автоматически.<br/>Отвечать на него необязательно.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendOwnerNotification(ctx: ContactMessageContext): Promise<void> {
  try {
    const to = sanitizeHeaderValue(requireEnv('MAIL_TO'));
    const from = sanitizeHeaderValue(requireEnv('YANDEX_EMAIL'));
    const replyTo = sanitizeHeaderValue(ctx.email);
    const transporter = createTransport();

    await transporter.sendMail({
      from: `"Portfolio Contact" <${from}>`,
      to,
      replyTo,
      subject: 'Новое сообщение с портфолио',
      text: [
        'Новое сообщение с портфолио',
        `Имя: ${ctx.name}`,
        `Email: ${ctx.email}`,
        `Компания: ${ctx.company || '—'}`,
        `IP: ${ctx.ip}`,
        `User-Agent: ${ctx.userAgent}`,
        `Дата/время: ${formatDateTime(ctx.receivedAt).full}`,
        '',
        ctx.message,
      ].join('\n'),
      html: ownerEmailHtml(ctx),
    });
  } catch {
    throw new Error('Email delivery failed');
  }
}

export async function sendAutoReply(ctx: ContactMessageContext): Promise<void> {
  try {
    const from = sanitizeHeaderValue(requireEnv('YANDEX_EMAIL'));
    const to = sanitizeHeaderValue(ctx.email);
    const transporter = createTransport();

    await transporter.sendMail({
      from: `"Anton Fedotov" <${from}>`,
      to,
      subject: 'Спасибо за ваше сообщение',
      text: [
        'Здравствуйте!',
        '',
        'Спасибо за ваше сообщение и интерес к моему портфолио.',
        'Ваше обращение успешно получено.',
        'Я обязательно ознакомлюсь с ним.',
        'Обычно отвечаю в течение 1–2 рабочих дней.',
        '',
        'С уважением,',
        'Антон Федотов',
        'Python Backend Developer',
        '',
        'Это письмо сформировано автоматически.',
        'Отвечать на него необязательно.',
      ].join('\n'),
      html: autoReplyHtml(ctx.name),
    });
  } catch {
    throw new Error('Email delivery failed');
  }
}
