export type SectionId =
  | 'hero'
  | 'about'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'certificates'
  | 'recommendations'
  | 'resume'
  | 'contact';

export interface NavItem {
  id: Exclude<SectionId, 'hero'>;
}

export interface SocialLink {
  id: 'github' | 'hh' | 'telegram' | 'email' | 'twitter';
  icon: 'github' | 'hh' | 'telegram' | 'email' | 'twitter';
}

export interface ProfileMeta {
  email?: string;
  phone?: string;
  yearsExperience: number;
  resumeUrl: string;
  formEndpoint?: string;
}

export interface ExperienceMeta {
  id: string;
  technologies: string[];
}

export interface SkillCategoryMeta {
  id: 'engineering' | 'backend' | 'qa';
  hasLearning?: boolean;
  hasMethods?: boolean;
  primarySkill?: string;
}

export interface ProjectMeta {
  id: string;
  year: string;
  tags: string[];
  featured?: boolean;
  /**
   * CTA behavior:
   * - external: open via /api/open-project (URL only on server)
   * - internal: navigate to an in-app case study route
   * - none: non-interactive label
   */
  cta: {
    type: 'external' | 'internal' | 'none';
    labelKey: 'openProject' | 'details';
    /** Server redirect key for type: external */
    projectKey?: 'door-soft';
    /** In-app route for type: internal */
    href?: string;
  };
}

export interface CertificateMeta {
  id: string;
  /** Imported image URL (Vite asset) or public path when available */
  imageSrc?: string;
  /** Language-agnostic skill badges shown on the card */
  badges: string[];
}

export interface RecommendationMeta {
  id: string;
  /** Full-quality letter page images (Vite URLs). Multi-page letters use ImageLightbox. */
  images?: string[];
  /** Relative public path to PDF or image scan when available */
  documentUrl?: string;
  documentType?: 'pdf' | 'image';
}

export type ContactStatusKey = 'success' | 'error' | 'mailto' | 'rateLimited' | 'deliveryError';

export interface ContactFormResult {
  ok: boolean;
  statusKey: ContactStatusKey;
}
