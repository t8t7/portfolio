import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils';

const fieldBase =
  'w-full rounded-sm border border-ink-line bg-ink-raised/80 px-4 py-3 text-sm text-chalk placeholder:text-fog/60 outline-none transition-colors duration-300 focus:border-accent/60 focus:ring-1 focus:ring-accent/30';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, id, error, className, ...props }: TextFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={fieldId}>
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-fog">
        {label}
      </span>
      <input id={fieldId} className={cn(fieldBase, className)} {...props} />
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextArea({ label, id, error, className, ...props }: TextAreaProps) {
  const fieldId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={fieldId}>
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-fog">
        {label}
      </span>
      <textarea
        id={fieldId}
        className={cn(fieldBase, 'min-h-36 resize-y', className)}
        {...props}
      />
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  );
}
