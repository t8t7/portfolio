import type { ReactNode } from 'react';
import { cn } from '@/utils';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  container?: 'page' | 'narrow' | 'none';
}

export function Section({
  id,
  children,
  className,
  container = 'page',
}: SectionProps) {
  return (
    <section id={id} className={cn('section-pad scroll-mt-24', className)}>
      {container === 'none' ? (
        children
      ) : (
        <div className={container === 'narrow' ? 'container-narrow' : 'container-page'}>
          {children}
        </div>
      )}
    </section>
  );
}
