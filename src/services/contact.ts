import type { ContactStatusKey } from '@/types';
import type { ContactFieldErrorCodes } from '../../shared/contactValidation';

export interface ContactFormPayload {
  name: string;
  email: string;
  company?: string;
  message: string;
  website?: string;
}

export interface ContactFormResult {
  ok: boolean;
  statusKey: ContactStatusKey;
  fieldErrors?: ContactFieldErrorCodes;
}

/**
 * Submits the contact form to the secured server endpoint.
 */
export async function submitContactForm(
  payload: ContactFormPayload,
): Promise<ContactFormResult> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      company: payload.company ?? '',
      message: payload.message,
      website: payload.website ?? '',
    }),
  });

  let data: {
    ok?: boolean;
    error?: string;
    errors?: ContactFieldErrorCodes;
  } = {};

  try {
    data = (await response.json()) as typeof data;
  } catch {
    data = {};
  }

  if (response.status === 429) {
    return { ok: false, statusKey: 'rateLimited' };
  }

  if (response.status === 413) {
    return { ok: false, statusKey: 'error' };
  }

  if (response.status === 400 && data.errors) {
    return {
      ok: false,
      statusKey: 'error',
      fieldErrors: data.errors,
    };
  }

  if (response.status === 502 || data.error === 'delivery_failed') {
    return { ok: false, statusKey: 'deliveryError' };
  }

  if (!response.ok || !data.ok) {
    return { ok: false, statusKey: 'error' };
  }

  return { ok: true, statusKey: 'success' };
}
