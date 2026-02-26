// Middleware to inject SEO meta tags and CSP nonce into HTML for all requests
import {
  SITE_NAME,
  ROUTE_METADATA,
  generateOgImageUrl,
} from "../src/config/seo-metadata";
import {
  buildCSPHeader,
  SECURITY_HEADERS,
} from "../src/config/security-headers";

interface BlogPostFields {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: string;
}

interface Env {
  CONTENTFUL_SPACE_ID?: string;
  CONTENTFUL_ACCESS_TOKEN?: string;
  CF_PAGES_URL?: string;
}

interface ContentfulResponse {
  items: Array<{
    fields: BlogPostFields;
  }>;
}

// Generate a cryptographically secure nonce
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

async function fetchBlogPost(
  slug: string,
  env: Env,
): Promise<BlogPostFields | null> {
  const spaceId = env.CONTENTFUL_SPACE_ID;
  const accessToken = env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    return null;
  }

  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=blogPost&fields.slug=${slug}&limit=1`,
    );

    if (!response.ok) {
      return null;
    }

    const data: ContentfulResponse = await response.json();
    return data.items[0]?.fields || null;
  } catch {
    return null;
  }
}

interface RouteMetadata {
  title: string;
  description: string;
  type: string;
  keywords?: string[];
}

async function getRouteMetadata(
  path: string,
  env: Env,
): Promise<RouteMetadata> {
  // Check for exact match first
  if (path in ROUTE_METADATA) {
    return ROUTE_METADATA[path as keyof typeof ROUTE_METADATA];
  }

  // Handle blog post pages - fetch real data from Contentful
  if (path.startsWith("/blog/")) {
    const slug = path.replace("/blog/", "");
    const blogPost = await fetchBlogPost(slug, env);

    if (blogPost) {
      return {
        title: blogPost.title,
        description: blogPost.excerpt,
        type: "article",
        keywords: ["cybersecurity", "blog", "security"],
      };
    }

    // Fallback if blog post not found
    return {
      title: `Blog Post | ${SITE_NAME}`,
      description: "Read the latest insights on cybersecurity.",
      type: "article",
    };
  }

  // Default fallback
  return ROUTE_METADATA["/"];
}

async function generateMetaTags(
  baseUrl: string,
  path: string,
  env: Env,
): Promise<string> {
  const metadata = await getRouteMetadata(path, env);
  const { title, description, type, keywords } = metadata;
  const canonicalUrl = `${baseUrl}${path}`;
  const ogImage = generateOgImageUrl(baseUrl, title, description, type);

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="author" content="${SITE_NAME}" />
    ${keywords?.length ? `<meta name="keywords" content="${keywords.join(", ")}" />` : ""}
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
  `;
}

// Inject nonce into all script tags
function injectNonceIntoScripts(html: string, nonce: string): string {
  // Add nonce to module scripts (Vite entry point)
  html = html.replace(
    /<script type="module"/g,
    `<script nonce="${nonce}" type="module"`,
  );

  // Add nonce to regular scripts without nonce
  html = html.replace(
    /<script(?!.*nonce)([^>]*)>/g,
    `<script nonce="${nonce}"$1>`,
  );

  // Handle the font loader inline script in the link onload
  // This is tricky - we need to allow it via strict-dynamic propagation
  // The onload handler will work because it's an event handler, not a script tag

  return html;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Skip for assets, API routes, and the OG image endpoint
  if (
    path.startsWith("/og") ||
    path.startsWith("/assets") ||
    path.includes(".")
  ) {
    return next();
  }

  // Get the original response
  const response = await next();

  // Only process HTML responses
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  // Generate unique nonce for this request
  const nonce = generateNonce();

  // Get base URL from CF_PAGES_URL or construct from request
  const baseUrl = env.CF_PAGES_URL || `${url.protocol}//${url.host}`;

  // Determine if this is a blog post route and check existence
  let blogPostNotFound = false;
  if (path.startsWith("/blog/") && path !== "/blog/") {
    const slug = path.replace("/blog/", "").replace(/\/$/, "");
    if (slug.length > 0 && !slug.startsWith("series")) {
      const blogPost = await fetchBlogPost(slug, env);
      if (!blogPost) {
        blogPostNotFound = true;
      }
    }
  }

  // Get original HTML and inject meta tags + nonce
  let html = await response.text();
  const metaTags = await generateMetaTags(baseUrl, path, env);

  // Insert meta tags after <head> tag
  html = html.replace("<head>", `<head>${metaTags}`);

  // Inject nonce into all script tags
  html = injectNonceIntoScripts(html, nonce);

  // Build new headers with CSP
  const headers = new Headers(response.headers);

  // Add CSP with nonce
  headers.set("Content-Security-Policy", buildCSPHeader(nonce));

  // Add other security headers
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(html, {
    status: blogPostNotFound ? 404 : response.status,
    headers,
  });
};
