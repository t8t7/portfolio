import type { AppLanguage } from '@/i18n/config';

export const PUBLIC_ORIGIN = 'https://antonfedotov.com';

export type SeoRouteId =
  | 'home'
  | 'pythonBackend'
  | 'engineeringDesign'
  | 'sandbox'
  | 'ispring'
  | 'notFound';

interface SeoRoute {
  id: Exclude<SeoRouteId, 'notFound'>;
  ruPath: string;
  enPath: string;
}

export const SEO_ROUTES: SeoRoute[] = [
  { id: 'home', ruPath: '/', enPath: '/en/' },
  {
    id: 'pythonBackend',
    ruPath: '/python-backend-developer',
    enPath: '/en/python-backend-developer',
  },
  {
    id: 'engineeringDesign',
    ruPath: '/engineer-designer',
    enPath: '/en/engineer-designer',
  },
  { id: 'sandbox', ruPath: '/projects/sandbox', enPath: '/en/projects/sandbox' },
  {
    id: 'ispring',
    ruPath: '/projects/ispring-testing',
    enPath: '/en/projects/ispring-testing',
  },
];

export function normalizePathname(pathname: string): string {
  if (pathname === '/en' || pathname === '/en/') return '/en/';
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname || '/';
}

export function getLanguageFromPath(pathname: string): AppLanguage {
  const normalized = normalizePathname(pathname);
  return normalized === '/en/' || normalized.startsWith('/en/') ? 'en' : 'ru';
}

export function getSeoRoute(pathname: string): SeoRoute | undefined {
  const normalized = normalizePathname(pathname);
  return SEO_ROUTES.find(
    (route) => route.ruPath === normalized || route.enPath === normalized,
  );
}

export function getLocalizedPath(pathname: string, language: AppLanguage): string {
  const route = getSeoRoute(pathname);
  if (!route) return language === 'en' ? '/en/' : '/';
  return language === 'en' ? route.enPath : route.ruPath;
}

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, `${PUBLIC_ORIGIN}/`).toString();
}

function personSchema() {
  return {
    '@type': 'Person',
    '@id': `${PUBLIC_ORIGIN}/#person`,
    name: 'Антон Федотов',
    alternateName: 'Anton Fedotov',
    url: `${PUBLIC_ORIGIN}/`,
    jobTitle: ['Python Backend Developer', 'Инженер-конструктор'],
    sameAs: [
      'https://github.com/t8t7',
      'https://hh.ru/resume/83fe663dff10dff6100039ed1f38357458524f',
      'https://t.me/anubis_umbra',
    ],
  };
}

export function buildStructuredData(
  routeId: Exclude<SeoRouteId, 'notFound'>,
  canonical: string,
  title: string,
  description: string,
) {
  const personId = `${PUBLIC_ORIGIN}/#person`;
  const websiteId = `${PUBLIC_ORIGIN}/#website`;
  const graph: Record<string, unknown>[] = [
    personSchema(),
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: 'Антон Федотов — портфолио',
      alternateName: 'Anton Fedotov Portfolio',
      url: `${PUBLIC_ORIGIN}/`,
      inLanguage: ['ru', 'en'],
      author: { '@id': personId },
    },
    {
      '@type': routeId === 'home' ? 'ProfilePage' : 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      isPartOf: { '@id': websiteId },
      about: { '@id': personId },
    },
  ];

  if (routeId === 'pythonBackend' || routeId === 'engineeringDesign') {
    graph.push({
      '@type': 'Service',
      name: title,
      description,
      url: canonical,
      provider: { '@id': personId },
      areaServed: 'Worldwide',
      serviceType: routeId === 'pythonBackend'
        ? 'Python backend development'
        : 'Mechanical design and engineering documentation',
    });
  } else if (routeId !== 'home') {
    graph.push({
      '@type': routeId === 'sandbox' ? 'SoftwareApplication' : 'CreativeWork',
      name: title,
      description,
      url: canonical,
      author: { '@id': personId },
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
