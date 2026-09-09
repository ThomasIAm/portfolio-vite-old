import { siteConfig } from "../src/config/site";

interface BlogPost {
  fields: {
    slug: string;
    modifiedDate?: string;
    publishedDate: string;
  };
}

interface SitemapEnv {
  CONTENTFUL_SPACE_ID?: string;
  CONTENTFUL_ACCESS_TOKEN?: string;
}

async function fetchBlogPosts(env: SitemapEnv): Promise<BlogPost[]> {
  const spaceId = env.CONTENTFUL_SPACE_ID;
  const accessToken = env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    return [];
  }

  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?content_type=blogPost&select=fields.slug,fields.publishedDate,fields.modifiedDate`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.items || [];
  } catch {
    return [];
  }
}

function formatDate(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

export const onRequest: PagesFunction = async (context) => {
  const baseUrl = siteConfig.siteUrl || context.env.CF_PAGES_URL || new URL(context.request.url).origin;

  // Static routes with their priorities and change frequencies
  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'monthly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/projects', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog', priority: '0.9', changefreq: 'weekly' },
    { path: '/contact', priority: '0.6', changefreq: 'yearly' },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/cookies', priority: '0.3', changefreq: 'yearly' },
    { path: '/notice', priority: '0.3', changefreq: 'yearly' },
  ];

  // Fetch blog posts from Contentful
  const blogPosts = await fetchBlogPosts(context.env);

  const today = formatDate(new Date().toISOString());

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static routes
  for (const route of staticRoutes) {
    xml += `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
  }

  // Add blog posts
  for (const post of blogPosts) {
    const lastmod = formatDate(post.fields.modifiedDate || post.fields.publishedDate);
    xml += `  <url>
    <loc>${baseUrl}/blog/${post.fields.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
