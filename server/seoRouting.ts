export const INDEXABLE_PATHS = new Set([
  '/',
  '/en/',
  '/python-backend-developer',
  '/en/python-backend-developer',
  '/engineer-designer',
  '/en/engineer-designer',
  '/projects/sandbox',
  '/en/projects/sandbox',
  '/projects/ispring-testing',
  '/en/projects/ispring-testing',
]);

export function canonicalPathRedirect(pathname: string): string | undefined {
  if (pathname === '/index.html') return '/';
  if (pathname === '/en') return '/en/';
  if (pathname === '/engineering-design' || pathname === '/engineering-design/') {
    return '/engineer-designer';
  }
  if (pathname === '/en/engineering-design' || pathname === '/en/engineering-design/') {
    return '/en/engineer-designer';
  }
  if (pathname.length > 1 && pathname.endsWith('/') && pathname !== '/en/') {
    const withoutSlash = pathname.slice(0, -1);
    if (INDEXABLE_PATHS.has(withoutSlash)) return withoutSlash;
  }
  return undefined;
}

export function pageHtmlPath(pathname: string): string | undefined {
  if (!INDEXABLE_PATHS.has(pathname)) return undefined;
  if (pathname === '/') return 'index.html';
  return `${pathname.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
}
