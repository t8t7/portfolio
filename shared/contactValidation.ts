export type ContactField = 'name' | 'email' | 'company' | 'message';

export interface ContactInput {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  /** Honeypot — must be empty */
  website?: unknown;
}

export interface ContactSanitized {
  name: string;
  email: string;
  company: string;
  message: string;
}

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactErrorCode =
  | 'required'
  | 'nameChars'
  | 'nameLength'
  | 'emailInvalid'
  | 'emailLength'
  | 'companyLength'
  | 'messageMin'
  | 'messageMax'
  | 'unsafe'
  | 'invalidType';

export type ContactFieldErrorCodes = Partial<Record<ContactField, ContactErrorCode>>;

const NAME_PATTERN = /^[A-Za-zА-Яа-яЁё -]+$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const XSS_PATTERNS: RegExp[] = [
  /<\s*script\b/i,
  /<\s*img\b/i,
  /<\s*iframe\b/i,
  /<\s*object\b/i,
  /<\s*embed\b/i,
  /<\s*svg\b/i,
  /<\s*link\b/i,
  /<\s*style\b/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
  /\bon\w+\s*=/i,
  /&#x?[0-9a-f]+;?/i,
  /<\s*\/\s*script\s*>/i,
];

const SQLI_PATTERNS: RegExp[] = [
  /('\s*or\s*['"]?\d|'\s*or\s*'\w+'\s*=\s*'\w+)/i,
  /\bunion\s+select\b/i,
  /\bdrop\s+table\b/i,
  /\binsert\s+into\b/i,
  /\bdelete\s+from\b/i,
  /\bupdate\s+\w+\s+set\b/i,
  /;--/,
  /--\s*$/,
  /\/\*|\*\//,
  /\bexec(\s|\()/i,
  /\bxp_\w+/i,
];

function isUnsafeContent(value: string): boolean {
  return (
    XSS_PATTERNS.some((pattern) => pattern.test(value)) ||
    SQLI_PATTERNS.some((pattern) => pattern.test(value))
  );
}

function asTrimmedString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return value.trim();
}

/** Returns true when honeypot was filled (bot). */
export function isHoneypotTriggered(input: ContactInput): boolean {
  if (input.website === undefined || input.website === null) return false;
  if (typeof input.website !== 'string') return true;
  return input.website.trim().length > 0;
}

/**
 * Shared contact-form validation for browser and server.
 * Returns machine-readable error codes — UI maps them to localized copy.
 */
export function validateContactInput(input: ContactInput): {
  ok: boolean;
  data?: ContactSanitized;
  errors: ContactFieldErrorCodes;
} {
  const errors: ContactFieldErrorCodes = {};

  const name = asTrimmedString(input.name);
  const email = asTrimmedString(input.email);
  const companyRaw = input.company;
  const message = asTrimmedString(input.message);

  if (name === null) {
    errors.name = 'invalidType';
  } else if (!name) {
    errors.name = 'required';
  } else if (/[\r\n\0\v\f]/.test(name)) {
    errors.name = 'unsafe';
  } else if (isUnsafeContent(name)) {
    errors.name = 'unsafe';
  } else if (!NAME_PATTERN.test(name)) {
    errors.name = 'nameChars';
  } else if (name.length < 2 || name.length > 60) {
    errors.name = 'nameLength';
  }

  if (email === null) {
    errors.email = 'invalidType';
  } else if (!email) {
    errors.email = 'required';
  } else if (/[\r\n\0\v\f]/.test(email)) {
    errors.email = 'unsafe';
  } else if (isUnsafeContent(email)) {
    errors.email = 'unsafe';
  } else if (email.length > 100) {
    errors.email = 'emailLength';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'emailInvalid';
  }

  let company = '';
  if (companyRaw !== undefined && companyRaw !== null && companyRaw !== '') {
    if (typeof companyRaw !== 'string') {
      errors.company = 'invalidType';
    } else {
      company = companyRaw.trim();
      if (company) {
        if (/[\r\n\0\v\f]/.test(company)) {
          errors.company = 'unsafe';
        } else if (isUnsafeContent(company)) {
          errors.company = 'unsafe';
        } else if (company.length > 100) {
          errors.company = 'companyLength';
        }
      }
    }
  }

  if (message === null) {
    errors.message = 'invalidType';
  } else if (!message) {
    errors.message = 'required';
  } else if (isUnsafeContent(message)) {
    errors.message = 'unsafe';
  } else if (message.length < 10) {
    errors.message = 'messageMin';
  } else if (message.length > 2000) {
    errors.message = 'messageMax';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    data: {
      name: name as string,
      email: email as string,
      company,
      message: message as string,
    },
  };
}
