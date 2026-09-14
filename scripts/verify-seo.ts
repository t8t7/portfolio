import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { absoluteUrl, SEO_ROUTES } from '../src/seo/config';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`SEO verification failed: ${message}`);
}

function count(content: string, expression: RegExp): number {
  return content.match(expression)?.length ?? 0;
}

async function verifyPage(pathname: string, ruPath: string, enPath: string) {
  const filePath = pathname === '/'
    ? resolve(dist, 'index.html')
    : resolve(dist, pathname.replace(/^\//, ''), 'index.html');
  const html = await readFile(filePath, 'utf8');
  const canonical = absoluteUrl(pathname);

  assert(count(html, /<title>[^<]+<\/title>/g) === 1, `${pathname} must have one title`);
  assert(count(html, /<meta name="description"[^>]*>/g) === 1, `${pathname} must have one description`);
  assert(count(html, /<link rel="canonical"[^>]*>/g) === 1, `${pathname} must have one canonical`);
  assert(html.includes(`rel="canonical" href="${canonical}"`), `${pathname} canonical mismatch`);
  assert(html.includes(`hreflang="ru" href="${absoluteUrl(ruPath)}"`), `${pathname} missing RU alternate`);
  assert(html.includes(`hreflang="en" href="${absoluteUrl(enPath)}"`), `${pathname} missing EN alternate`);
  assert(html.includes('hreflang="x-default"'), `${pathname} missing x-default`);
  assert(html.includes('name="robots" content="index, follow, max-image-preview:large"'), `${pathname} robots mismatch`);
  assert(html.includes('property="og:image" content="https://antonfedotov.com/og/anton-fedotov-portfolio.jpg"'), `${pathname} missing OG image`);
  assert(html.includes('property="og:image:width" content="1200"'), `${pathname} OG image width mismatch`);
  assert(html.includes('property="og:image:height" content="630"'), `${pathname} OG image height mismatch`);
  assert(html.includes('name="twitter:card" content="summary_large_image"'), `${pathname} Twitter card mismatch`);
  assert(html.includes('name="twitter:image" content="https://antonfedotov.com/og/anton-fedotov-portfolio.jpg"'), `${pathname} missing Twitter image`);
  assert(html.includes('id="structured-data" type="application/ld+json"'), `${pathname} missing JSON-LD`);
  assert(html.includes('id="seo-static"'), `${pathname} missing static content`);
  assert(count(html, /<h1>[^<]+<\/h1>/g) === 1, `${pathname} must have one static H1`);
}

async function main() {
  for (const route of SEO_ROUTES) {
    await verifyPage(route.ruPath, route.ruPath, route.enPath);
    await verifyPage(route.enPath, route.ruPath, route.enPath);
  }

  const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8');
  assert(robots.includes('Allow: /'), 'robots.txt must allow public pages');
  assert(robots.includes('Sitemap: https://antonfedotov.com/sitemap.xml'), 'robots.txt must reference sitemap');

  const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert(locations.length === SEO_ROUTES.length * 2, 'sitemap URL count mismatch');
  assert(new Set(locations).size === locations.length, 'sitemap contains duplicate URLs');
}

await main();
