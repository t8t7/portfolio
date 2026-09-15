import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { absoluteUrl, buildStructuredData, SEO_ROUTES } from '../src/seo/config';

interface LocalizedItem {
  title?: string;
  description?: string;
  company?: string;
  role?: string;
  period?: string;
  summary?: string;
  task?: string;
  solution?: string;
  result?: string;
  responsibilities?: string[];
  skills?: string[];
  href?: string;
}

interface LocaleData {
  profile: { name: string; title: string };
  hero: { headline: string; description: string };
  capabilities: { title: string; items: LocalizedItem[] };
  projects: { title: string; items: Record<string, LocalizedItem> };
  experience: { title: string; items: Record<string, LocalizedItem> };
  services: { title: string; items: LocalizedItem[] };
  landingPages: Record<string, {
    eyebrow: string;
    title: string;
    lead: string;
    proofTitle: string;
    proof: string[];
    workTitle: string;
    work: LocalizedItem[];
    projectsTitle: string;
    projects: Array<LocalizedItem & { href: string }>;
    relatedText: string;
    relatedHref: string;
    contactText: string;
  }>;
  skills: { title: string; categories: Record<string, LocalizedItem> };
  production: { title: string; description: string };
  about: { headline: string; paragraphs: string[] };
  contact: { headline: string; description: string };
  caseStudy: Record<string, unknown>;
  meta: {
    routes: Record<string, { title: string; description: string }>;
  };
}

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const socialImage = absoluteUrl('/og/anton-fedotov-portfolio.jpg');

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function list(items: string[] | undefined): string {
  if (!items?.length) return '';
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function cards(items: LocalizedItem[]): string {
  return items
    .map((item) => {
      const title = item.href
        ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.title)}</a>`
        : escapeHtml(item.title);
      return `<article><h3>${title}</h3><p>${escapeHtml(item.description)}</p></article>`;
    })
    .join('');
}

function projectPath(id: string, language: 'ru' | 'en'): string | undefined {
  const prefix = language === 'en' ? '/en' : '';
  if (id === 'door-sandbox') return `${prefix}/projects/sandbox`;
  if (id === 'ispring-lms') return `${prefix}/projects/ispring-testing`;
  return undefined;
}

function renderHome(locale: LocaleData, language: 'ru' | 'en'): string {
  const projects = Object.entries(locale.projects.items)
    .map(([id, item]) => {
      const href = projectPath(id, language);
      const title = href
        ? `<a href="${href}">${escapeHtml(item.title)}</a>`
        : escapeHtml(item.title);
      return `<article><h3>${title}</h3><p>${escapeHtml(item.summary)}</p><h4>${escapeHtml(item.task)}</h4><p>${escapeHtml(item.solution)}</p><p>${escapeHtml(item.result)}</p></article>`;
    })
    .join('');
  const experience = Object.values(locale.experience.items)
    .map((item) => `<article><h3>${escapeHtml(item.company)}</h3><p>${escapeHtml(item.role)} · ${escapeHtml(item.period)}</p><p>${escapeHtml(item.summary)}</p>${list(item.responsibilities)}</article>`)
    .join('');
  const skills = Object.values(locale.skills.categories)
    .map((item) => `<article><h3>${escapeHtml(item.title)}</h3>${list(item.skills)}</article>`)
    .join('');

  return `<main><header><p>${escapeHtml(locale.profile.name)}</p><p>${escapeHtml(locale.profile.title)}</p><h1>${escapeHtml(locale.hero.headline)}</h1><p>${escapeHtml(locale.hero.description)}</p></header><section><h2>${escapeHtml(locale.capabilities.title)}</h2>${cards(locale.capabilities.items)}</section><section><h2>${escapeHtml(locale.projects.title)}</h2>${projects}</section><section><h2>${escapeHtml(locale.experience.title)}</h2>${experience}</section><section><h2>${escapeHtml(locale.services.title)}</h2>${cards(locale.services.items)}</section><section><h2>${escapeHtml(locale.skills.title)}</h2>${skills}</section><section><h2>${escapeHtml(locale.production.title)}</h2><p>${escapeHtml(locale.production.description)}</p></section><section><h2>${escapeHtml(locale.about.headline)}</h2>${locale.about.paragraphs.map((item) => `<p>${escapeHtml(item)}</p>`).join('')}</section><section><h2>${escapeHtml(locale.contact.headline)}</h2><p>${escapeHtml(locale.contact.description)}</p></section></main>`;
}

function objectValue(record: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = record[key];
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function stringArray(record: Record<string, unknown>, key: string): string[] {
  const value = record[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function renderCaseStudy(
  locale: LocaleData,
  id: 'sandbox' | 'ispring',
  language: 'ru' | 'en',
): string {
  const study = objectValue(locale.caseStudy, id);
  const overview = study.overview;
  const sections = id === 'sandbox'
    ? ['architecture', 'tasks']
    : ['tested', 'tools', 'tasks'];
  const content = sections.map((key) => {
    const titleKey = `${key}Title`;
    return `<section><h2>${escapeHtml(study[titleKey])}</h2>${list(stringArray(study, key))}</section>`;
  }).join('');

  const prefix = language === 'en' ? '/en' : '';
  const homePath = language === 'en' ? '/en/' : '/';
  const otherProject = id === 'sandbox'
    ? `${prefix}/projects/ispring-testing`
    : `${prefix}/projects/sandbox`;
  const navigation = `<nav aria-label="Related pages"><a href="${homePath}">${escapeHtml(locale.profile.name)}</a><a href="${prefix}/python-backend-developer">Python Backend</a><a href="${prefix}/engineer-designer">Engineering</a><a href="${otherProject}">Related project</a></nav>`;

  return `<main>${navigation}<article><p>${escapeHtml(study.eyebrow)}</p><h1>${escapeHtml(study.title)}</h1><p>${escapeHtml(study.role)} · ${escapeHtml(study.year)}</p><section><h2>${escapeHtml(study.overviewTitle)}</h2><p>${escapeHtml(overview)}</p></section>${content}</article></main>`;
}

function renderLanding(locale: LocaleData, id: 'pythonBackend' | 'engineeringDesign'): string {
  const page = locale.landingPages[id];
  const work = page.work
    .map((item) => `<article><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`)
    .join('');
  const projects = page.projects
    .map((item) => `<article><h3><a href="${escapeHtml(item.href)}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.description)}</p></article>`)
    .join('');

  return `<main><article><p>${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.lead)}</p><section><h2>${escapeHtml(page.proofTitle)}</h2>${list(page.proof)}</section><section><h2>${escapeHtml(page.workTitle)}</h2>${work}</section><section><h2>${escapeHtml(page.projectsTitle)}</h2>${projects}</section><p><a href="${escapeHtml(page.relatedHref)}">${escapeHtml(page.relatedText)}</a></p></article></main>`;
}

function setMeta(html: string, attribute: 'name' | 'property', key: string, content: string): string {
  const expression = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return expression.test(html) ? html.replace(expression, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function setHead(html: string, options: {
  language: 'ru' | 'en';
  title: string;
  description: string;
  canonical: string;
  ruUrl: string;
  enUrl: string;
  schema: object;
  routeId: 'home' | 'pythonBackend' | 'engineeringDesign' | 'sandbox' | 'ispring';
}): string {
  let output = html.replace(/<html lang="[^"]+">/, `<html lang="${options.language}">`);
  output = output.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(options.title)}</title>`);
  output = setMeta(output, 'name', 'description', options.description);
  output = setMeta(output, 'name', 'robots', 'index, follow, max-image-preview:large');
  output = setMeta(output, 'property', 'og:title', options.title);
  output = setMeta(output, 'property', 'og:description', options.description);
  output = setMeta(output, 'property', 'og:url', options.canonical);
  output = setMeta(
    output,
    'property',
    'og:type',
    options.routeId === 'home' || options.routeId === 'pythonBackend' || options.routeId === 'engineeringDesign'
      ? 'profile'
      : 'article',
  );
  output = setMeta(output, 'property', 'og:locale', options.language === 'en' ? 'en_US' : 'ru_RU');
  output = setMeta(output, 'property', 'og:image', socialImage);
  output = setMeta(output, 'property', 'og:image:secure_url', socialImage);
  output = setMeta(output, 'property', 'og:image:type', 'image/jpeg');
  output = setMeta(output, 'property', 'og:image:width', '1200');
  output = setMeta(output, 'property', 'og:image:height', '630');
  output = setMeta(output, 'property', 'og:image:alt', options.title);
  output = setMeta(output, 'name', 'twitter:card', 'summary_large_image');
  output = setMeta(output, 'name', 'twitter:title', options.title);
  output = setMeta(output, 'name', 'twitter:description', options.description);
  output = setMeta(output, 'name', 'twitter:image', socialImage);
  output = setMeta(output, 'name', 'twitter:image:alt', options.title);
  output = output.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${options.canonical}" />`);
  output = output.replace(/\s*<link rel="alternate" hreflang="[^"]+"[^>]*>/gi, '');
  const alternates = `<link rel="alternate" hreflang="ru" href="${options.ruUrl}" />\n    <link rel="alternate" hreflang="en" href="${options.enUrl}" />\n    <link rel="alternate" hreflang="x-default" href="${options.ruUrl}" />`;
  output = output.replace(/(<link rel="canonical"[^>]*>)/i, `$1\n    ${alternates}`);
  const schemaJson = JSON.stringify(options.schema).replaceAll('<', '\\u003c');
  return output.replace(/<script id="structured-data"[\s\S]*?<\/script>/i, `<script id="structured-data" type="application/ld+json">${schemaJson}</script>`);
}

function injectStaticContent(html: string, content: string): string {
  const staticContent = `<div id="seo-static">${content}</div>`;
  return html.replace(/<noscript>[\s\S]*?<\/noscript>/i, staticContent);
}

async function readLocale(language: 'ru' | 'en'): Promise<LocaleData> {
  const content = await readFile(resolve(root, 'src', 'locales', language, 'common.json'), 'utf8');
  return JSON.parse(content) as LocaleData;
}

async function main() {
  const template = await readFile(resolve(dist, 'index.html'), 'utf8');
  const locales = { ru: await readLocale('ru'), en: await readLocale('en') };

  for (const route of SEO_ROUTES) {
    for (const language of ['ru', 'en'] as const) {
      const pathname = language === 'en' ? route.enPath : route.ruPath;
      const metadata = locales[language].meta.routes[route.id];
      const canonical = absoluteUrl(pathname);
      const body = route.id === 'home'
        ? renderHome(locales[language], language)
        : route.id === 'pythonBackend' || route.id === 'engineeringDesign'
          ? renderLanding(locales[language], route.id)
          : renderCaseStudy(locales[language], route.id, language);
      const output = injectStaticContent(setHead(template, {
        language,
        title: metadata.title,
        description: metadata.description,
        canonical,
        ruUrl: absoluteUrl(route.ruPath),
        enUrl: absoluteUrl(route.enPath),
        schema: buildStructuredData(route.id, canonical, metadata.title, metadata.description),
        routeId: route.id,
      }), body);
      const outputPath = pathname === '/'
        ? resolve(dist, 'index.html')
        : resolve(dist, pathname.replace(/^\//, ''), 'index.html');
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, output, 'utf8');
    }
  }
}

await main();
