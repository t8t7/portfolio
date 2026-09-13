import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  as?: 'button' | 'a';
  download?: boolean | string;
  target?: string;
  rel?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-ink hover:bg-accent-soft focus-visible:outline-accent',
  secondary:
    'border border-ink-line bg-transparent text-chalk hover:border-accent/50 hover:text-accent-soft focus-visible:outline-accent',
  ghost:
    'bg-transparent text-mist hover:text-chalk focus-visible:outline-accent',
};

export function Button({
  children,
  variant = 'primary',
  className,
  href,
  as,
  type = 'button',
  download,
  target,
  rel,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-base font-medium tracking-[0.015em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    className,
  );

  if (href || as === 'a') {
    return (
      <a
        href={href}
        className={classes}
        download={download}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
