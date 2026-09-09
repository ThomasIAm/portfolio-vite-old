import { siteConfig } from "@/config/site";

export interface RouteMetadata {
  title: string;
  description: string;
  type: 'website' | 'article' | 'profile';
  keywords?: string[];
}

export const SITE_NAME = siteConfig.name;
export const DEFAULT_AUTHOR = SITE_NAME;

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/': {
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.seo.homeDescription,
    type: 'website',
    keywords: ['cyber security consultant', 'Cloudflare expert', 'Zero Trust', 'OpenShift administrator', 'security architect', 'Netherlands', 'DevSecOps'],
  },
  '/about': {
    title: `About | ${siteConfig.name}`,
    description: siteConfig.seo.aboutDescription,
    type: 'profile',
    keywords: ['cyber security', 'certifications', 'professional experience', 'Cloudflare', 'Red Hat'],
  },
  '/blog': {
    title: `Blog | ${siteConfig.name}`,
    description: siteConfig.seo.blogDescription,
    type: 'website',
    keywords: ['cyber security blog', 'cloud security', 'Zero Trust', 'security insights'],
  },
  '/projects': {
    title: `Projects | ${siteConfig.name}`,
    description: siteConfig.seo.projectsDescription,
    type: 'website',
    keywords: ['cyber security projects', 'cloud infrastructure', 'open source', 'development'],
  },
  '/contact': {
    title: `Contact | ${siteConfig.name}`,
    description: siteConfig.seo.contactDescription,
    type: 'website',
    keywords: ['contact', 'cyber security consulting', 'collaboration'],
  },
};

export function getRouteMetadata(path: string): RouteMetadata {
  // Direct match
  if (ROUTE_METADATA[path]) {
    return ROUTE_METADATA[path];
  }

  // Blog post pattern
  if (path.startsWith('/blog/') && path !== '/blog') {
    const slug = path.replace('/blog/', '');
    const formattedTitle = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      title: `${formattedTitle} | ${SITE_NAME}`,
      description: `Read "${formattedTitle}" - a blog post by ${SITE_NAME}, ${siteConfig.role}.`,
      type: 'article',
    };
  }

  // Default fallback
  return ROUTE_METADATA['/'];
}

export function generateOgImageUrl(baseUrl: string, title: string, description: string, type: string): string {
  const params = new URLSearchParams({
    title,
    description: description.slice(0, 150),
    type,
  });
  return `${baseUrl}/og?${params.toString()}`;
}
