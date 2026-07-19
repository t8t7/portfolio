import type { SectionId } from '@/types';

export function scrollToSection(id: SectionId | string): void {
  if (window.location.pathname !== '/') {
    window.location.assign(`/${id === 'hero' ? '' : `#${id}`}`);
    return;
  }

  const element = document.getElementById(id);
  if (!element) return;

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function formatExternalUrl(url: string): string {
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return url;
  return url;
}
