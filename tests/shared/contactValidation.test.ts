import { describe, expect, it } from 'vitest';
import {
  isHoneypotTriggered,
  validateContactInput,
} from '../../shared/contactValidation';

describe('validateContactInput', () => {
  it('accepts a valid payload', () => {
    const result = validateContactInput({
      name: 'Anton Fedotov',
      email: 'anton@example.com',
      company: 'Avalon',
      message: 'Hello, I would like to discuss a role.',
      website: '',
    });

    expect(result.ok).toBe(true);
    expect(result.data?.email).toBe('anton@example.com');
  });

  it('rejects invalid email formats', () => {
    const result = validateContactInput({
      name: 'Anton',
      email: 'bad-email',
      message: 'Hello, I would like to discuss a role.',
    });

    expect(result.ok).toBe(false);
    expect(result.errors.email).toBe('emailInvalid');
  });

  it('rejects empty required fields', () => {
    const result = validateContactInput({
      name: '',
      email: '',
      message: '',
    });

    expect(result.ok).toBe(false);
    expect(result.errors.name).toBe('required');
    expect(result.errors.email).toBe('required');
    expect(result.errors.message).toBe('required');
  });
});

describe('isHoneypotTriggered', () => {
  it('detects filled honeypot fields', () => {
    expect(isHoneypotTriggered({ website: '' })).toBe(false);
    expect(isHoneypotTriggered({ website: 'http://spam.test' })).toBe(true);
  });
});
