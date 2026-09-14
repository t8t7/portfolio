import { useMemo, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { socialLinks } from '@/data/portfolio';
import { submitContactForm } from '@/services/contact';
import type { ContactStatusKey } from '@/types';
import {
  validateContactInput,
  type ContactErrorCode,
  type ContactField,
  type ContactFieldErrorCodes,
} from '../../../shared/contactValidation';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Reveal } from '@/components/common/Reveal';
import { Button } from '@/components/ui/Button';
import { TextArea, TextField } from '@/components/ui/TextField';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { getOpenProfilePath } from '@/api/openProfile';

interface FormState {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
}

const initialState: FormState = {
  name: '',
  email: '',
  company: '',
  message: '',
  website: '',
};

function mapFieldErrors(
  codes: ContactFieldErrorCodes,
  translate: (key: string) => string,
): Partial<Record<ContactField, string>> {
  const mapped: Partial<Record<ContactField, string>> = {};

  (Object.keys(codes) as ContactField[]).forEach((field) => {
    const code = codes[field] as ContactErrorCode | undefined;
    if (!code) return;
    mapped[field] = translate(`contact.validation.${code}`);
  });

  return mapped;
}

export function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [statusKey, setStatusKey] = useState<ContactStatusKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const hasFieldErrors = useMemo(
    () => Object.values(fieldErrors).some(Boolean),
    [fieldErrors],
  );

  const validateAndSetErrors = (nextForm: FormState) => {
    const result = validateContactInput(nextForm);
    const mapped = mapFieldErrors(result.errors, t);
    setFieldErrors(mapped);
    return result.ok;
  };

  const updateField = (field: ContactField, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (attempted) {
        const result = validateContactInput(next);
        setFieldErrors(mapFieldErrors(result.errors, t));
      } else {
        setFieldErrors((prevErrors) => {
          if (!prevErrors[field]) return prevErrors;
          const rest = { ...prevErrors };
          delete rest[field];
          return rest;
        });
      }
      return next;
    });
    if (statusKey) setStatusKey(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    setStatusKey(null);

    const isValid = validateAndSetErrors(form);
    if (!isValid) return;

    setSubmitting(true);

    try {
      const result = await submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        message: form.message.trim(),
        website: form.website,
      });

      if (result.fieldErrors) {
        setFieldErrors(mapFieldErrors(result.fieldErrors, t));
        setStatusKey('error');
        return;
      }

      setStatusKey(result.statusKey);
      if (result.ok && result.statusKey === 'success') {
        setForm(initialState);
        setFieldErrors({});
        setAttempted(false);
      }
    } catch {
      setStatusKey('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={t('contact.eyebrow')}
            title={t('contact.headline')}
            description={t('contact.description')}
            className="mb-8 md:mb-10"
          />

          <Reveal className="mt-2 space-y-6">
            <p className="meta-readable font-medium uppercase text-fog">{t('contact.discussLabel')}</p>
            <p className="copy-readable">{t('contact.discuss')}</p>
            <div className="flex flex-wrap gap-3">
              <Button as="a" href={getOpenProfilePath('telegram')} target="_blank" rel="noopener noreferrer">
                Telegram
              </Button>
              <Button variant="secondary" as="a" href="#contact-form">Email</Button>
              <Button variant="secondary" as="a" href={getOpenProfilePath('github')} target="_blank" rel="noopener noreferrer">
                GitHub
              </Button>
            </div>
            <SocialLinks links={socialLinks} />
          </Reveal>
        </div>

        <Reveal>
          <form
            id="contact-form"
            onSubmit={onSubmit}
            className="relative space-y-5 border border-ink-line bg-ink-soft/50 p-6 sm:p-8"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label={t('contact.form.name')}
                name="name"
                required
                autoComplete="name"
                maxLength={60}
                value={form.name}
                error={fieldErrors.name}
                aria-invalid={Boolean(fieldErrors.name)}
                onChange={(event) => updateField('name', event.target.value)}
              />
              <TextField
                label={t('contact.form.email')}
                name="email"
                type="email"
                required
                autoComplete="email"
                maxLength={100}
                value={form.email}
                error={fieldErrors.email}
                aria-invalid={Boolean(fieldErrors.email)}
                onChange={(event) => updateField('email', event.target.value)}
              />
            </div>
            <TextField
              label={t('contact.form.company')}
              name="company"
              autoComplete="organization"
              maxLength={100}
              value={form.company}
              error={fieldErrors.company}
              aria-invalid={Boolean(fieldErrors.company)}
              onChange={(event) => updateField('company', event.target.value)}
            />
            <TextArea
              label={t('contact.form.message')}
              name="message"
              required
              maxLength={2000}
              value={form.message}
              error={fieldErrors.message}
              aria-invalid={Boolean(fieldErrors.message)}
              onChange={(event) => updateField('message', event.target.value)}
            />

            {/* Honeypot — hidden from users, ignored by assistive tech */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-10000px',
                top: 'auto',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
              }}
            >
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, website: event.target.value }))
                }
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button type="submit" disabled={submitting || (attempted && hasFieldErrors)}>
                {submitting ? t('contact.form.sending') : t('contact.form.submit')}
              </Button>
              {statusKey ? (
                <p className="whitespace-pre-line text-base leading-relaxed text-mist" role="status">
                  {t(`contact.status.${statusKey}`)}
                </p>
              ) : null}
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
