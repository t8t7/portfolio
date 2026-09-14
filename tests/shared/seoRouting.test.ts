import { describe, expect, it } from 'vitest';
import { canonicalPathRedirect, pageHtmlPath } from '../../server/seoRouting';

describe('SEO routing', () => {
  it('redirects duplicate path variants to canonical paths', () => {
    expect(canonicalPathRedirect('/index.html')).toBe('/');
    expect(canonicalPathRedirect('/en')).toBe('/en/');
    expect(canonicalPathRedirect('/projects/sandbox/')).toBe('/projects/sandbox');
    expect(canonicalPathRedirect('/engineer-designer/')).toBe('/engineer-designer');
    expect(canonicalPathRedirect('/engineering-design')).toBe('/engineer-designer');
  });

  it('maps only indexable routes to prerendered HTML', () => {
    expect(pageHtmlPath('/')).toBe('index.html');
    expect(pageHtmlPath('/en/')).toBe('en/index.html');
    expect(pageHtmlPath('/projects/ispring-testing')).toBe(
      'projects/ispring-testing/index.html',
    );
    expect(pageHtmlPath('/python-backend-developer')).toBe(
      'python-backend-developer/index.html',
    );
    expect(pageHtmlPath('/en/engineer-designer')).toBe(
      'en/engineer-designer/index.html',
    );
    expect(pageHtmlPath('/not-a-real-page')).toBeUndefined();
  });
});
