import { Head } from "@unhead/react";
import { useLocation } from "react-router-dom";
import { 
  SITE_NAME, 
  DEFAULT_AUTHOR, 
  getRouteMetadata, 
  generateOgImageUrl,
  type RouteMetadata 
} from "@/config/seo-metadata";
import { siteConfig } from "@/config/site";

interface SEOProps {
  // Override the shared config if needed
  title?: string;
  description?: string;
  canonical?: string;
  type?: "website" | "article" | "profile";
  keywords?: string[];
  // Additional props for articles
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
  structuredData?: object;
}

const BASE_URL = import.meta.env.VITE_CF_PAGES_URL || siteConfig.siteUrl;

export function SEO({
  title: titleOverride,
  description: descriptionOverride,
  canonical,
  type: typeOverride,
  keywords: keywordsOverride,
  publishedDate,
  modifiedDate,
  author = DEFAULT_AUTHOR,
  structuredData,
}: SEOProps = {}) {
  const location = useLocation();
  const path = location.pathname;
  
  // Get default metadata from shared config
  const defaultMetadata = getRouteMetadata(path);
  
  // Allow overrides
  const title = titleOverride || defaultMetadata.title;
  const description = descriptionOverride || defaultMetadata.description;
  const type = typeOverride || defaultMetadata.type;
  const keywords = keywordsOverride || defaultMetadata.keywords || [];

  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${path}`;
  const ogImage = generateOgImageUrl(BASE_URL, title, description, type);

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "BlogPosting" : type === "profile" ? "ProfilePage" : "WebPage",
    name: title,
    description,
    url: canonicalUrl,
    image: ogImage,
      author: {
        "@type": "Person",
        name: SITE_NAME,
        url: BASE_URL,
        jobTitle: siteConfig.role,
        sameAs: siteConfig.sameAs,
      },
    ...(publishedDate && { datePublished: publishedDate }),
    ...(modifiedDate && { dateModified: modifiedDate }),
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article specific */}
      {type === "article" && publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {type === "article" && modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}
      {type === "article" && <meta property="article:author" content={author} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Head>
  );
}
