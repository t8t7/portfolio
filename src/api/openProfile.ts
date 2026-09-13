export type SocialProfileId = 'github' | 'hh' | 'telegram';
export type ProjectRedirectId = 'door-soft' | 'goodpapa';

/** Same-origin path only — real destination URLs live on the server. */
export function getOpenProfilePath(profile: SocialProfileId): string {
  return `/api/open-profile?profile=${encodeURIComponent(profile)}`;
}

/** Same-origin path only — real project URLs live on the server. */
export function getOpenProjectPath(project: ProjectRedirectId): string {
  return `/api/open-project?project=${encodeURIComponent(project)}`;
}

/**
 * Top-level browser navigation to the server redirect endpoint.
 * The browser follows HTTP 302 to GitHub / HH / Telegram.
 */
export function openSocialProfile(profile: SocialProfileId): void {
  window.open(getOpenProfilePath(profile), '_blank', 'noopener,noreferrer');
}
