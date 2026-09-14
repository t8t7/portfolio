import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { absoluteUrl, buildStructuredData, getLanguageFromPath, getSeoRoute } from '@/seo/config';

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string, hrefLang?: string) {
  const selector = hrefLang
    ? `link[rel="${rel}"][hreflang="${hrefLang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    if (hrefLang) element.hreflang = hrefLang;
    document.head.appendChild(element);
  }
  element.href = href;
}

export function useDocumentMeta(): void {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const route = getSeoRoute(location.pathname);
    const language = getLanguageFromPath(location.pathname);
    const routeId = route?.id ?? 'notFound';
    const title = t(`meta.routes.${routeId}.title`);
    const description = t(`meta.routes.${routeId}.description`);
    const canonical = route
      ? absoluteUrl(language === 'en' ? route.enPath : route.ruPath)
      : absoluteUrl('/');
    const socialImage = absoluteUrl('/og/anton-fedotov-portfolio.jpg');

    document.documentElement.lang = language;
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', route ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta(
      'meta[property="og:type"]',
      'property',
      'og:type',
      routeId === 'home' || routeId === 'pythonBackend' || routeId === 'engineeringDesign'
        ? 'profile'
        : 'article',
    );
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', language === 'en' ? 'en_US' : 'ru_RU');
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    setMeta('meta[property="og:image"]', 'property', 'og:image', socialImage);
    setMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', socialImage);
    setMeta('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/jpeg');
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', title);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', socialImage);
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', title);
    setLink('canonical', canonical);

    document.head
      .querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')
      .forEach((element) => element.remove());

    if (route) {
      setLink('alternate', absoluteUrl(route.ruPath), 'ru');
      setLink('alternate', absoluteUrl(route.enPath), 'en');
      setLink('alternate', absoluteUrl(route.ruPath), 'x-default');
    }

    let schema = document.getElementById('structured-data');
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'structured-data';
      schema.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schema);
    }
    schema.textContent = route
      ? JSON.stringify(buildStructuredData(route.id, canonical, title, description))
      : '';
  }, [location.pathname, t]);
}
