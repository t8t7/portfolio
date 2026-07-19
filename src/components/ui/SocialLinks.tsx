import { useTranslation } from 'react-i18next';
import type { SocialLink } from '@/types';
import { getOpenProfilePath, type SocialProfileId } from '@/api/openProfile';
import { cn } from '@/utils';
import hhLogo from '@/assets/icons/hh.svg';

const icons = {
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.8c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.48A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  ),
  hh: (
    <img
      src={hhLogo}
      alt=""
      aria-hidden="true"
      width={20}
      height={20}
      className="h-5 w-5 object-contain"
      draggable={false}
    />
  ),
  telegram: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2Zm4.6 7.17-1.55 7.29c-.12.52-.42.65-.86.4l-2.38-1.75-1.15 1.11c-.13.13-.23.23-.47.23l.17-2.42 4.41-3.98c.19-.17-.04-.27-.3-.1l-5.45 3.43-2.35-.73c-.51-.16-.52-.51.11-.76l9.18-3.54c.42-.15.79.1.65.62Z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.57l-5.15-6.72L5.2 22H1.94l8.03-9.17L1.5 2h6.74l4.65 6.16L18.244 2Zm-1.15 18h1.82L7.01 3.94H5.06L17.094 20Z" />
    </svg>
  ),
} as const;

const SERVER_PROFILES = new Set<SocialProfileId>(['github', 'hh', 'telegram']);

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
}

export function SocialLinks({ links, className }: SocialLinksProps) {
  const { t } = useTranslation();

  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {links.map((link) => {
        const label = t(`social.${link.id}`);
        const classNameLink =
          'inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-ink-line bg-transparent text-fog transition-colors duration-300 hover:border-accent/40 hover:text-accent-soft';

        if (SERVER_PROFILES.has(link.id as SocialProfileId)) {
          const profile = link.id as SocialProfileId;

          return (
            <li key={link.id}>
              <a
                href={getOpenProfilePath(profile)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={classNameLink}
              >
                {icons[link.icon]}
              </a>
            </li>
          );
        }

        return (
          <li key={link.id}>
            <span
              role="link"
              aria-disabled="true"
              aria-label={`${label}. ${t('social.placeholder')}`}
              title={t('social.placeholder')}
              className={cn(classNameLink, 'cursor-default opacity-70')}
            >
              {icons[link.icon]}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
