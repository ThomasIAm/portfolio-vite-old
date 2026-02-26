import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BlogContent } from "@/components/blog/BlogContent";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { calculateReadingTime, type BlogPost } from "@/lib/contentful";
import { Calendar, Clock, ArrowLeft, RefreshCw, BookOpen, Eye, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { SEO } from "@/components/seo/SEO";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Preview() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = async () => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/preview?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to load preview (${res.status})`);
      }
      const data = await res.json();
      setPost(data as BlogPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load preview");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreview();
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <SEO title="Loading Preview..." description="Loading draft content" />
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-64 bg-muted rounded mt-8" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <SEO title="Preview Not Found" description="The preview content could not be loaded." />
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Preview unavailable
              </h1>
              <p className="text-muted-foreground mb-8">
                {error || "The content you're trying to preview doesn't exist or the Preview API is not configured."}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={fetchPreview}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
                <Link
                  to="/blog"
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const fields = post.fields;
  const readingTime = calculateReadingTime(fields.content);

  return (
    <Layout>
      <SEO
        title={`Preview: ${fields.title}`}
        description={fields.excerpt}
        canonical={`/blog/${fields.slug}`}
        type="article"
      />

      {/* Preview Banner */}
      <div className="sticky top-0 z-50 bg-amber-500 dark:bg-amber-600 text-amber-950 dark:text-amber-50">
        <div className="container py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Eye className="h-4 w-4" />
            <span>Draft Preview</span>
            <span className="hidden sm:inline">— This content has not been published yet</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchPreview}
              className="h-7 text-amber-950 dark:text-amber-50 hover:bg-amber-600 dark:hover:bg-amber-700"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Refresh
            </Button>
            <Link to="/blog">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-amber-950 dark:text-amber-50 hover:bg-amber-600 dark:hover:bg-amber-700"
              >
                Exit Preview
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <Link
              to="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {fields.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(fields.publishedDate), "MMMM d, yyyy")}
              </span>
              {fields.modifiedDate && fields.modifiedDate !== fields.publishedDate && (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Updated {format(new Date(fields.modifiedDate), "MMMM d, yyyy")}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readingTime}
              </span>
            </div>

            {/* Authors */}
            {fields.author && fields.author.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                {fields.author.map((author) => (
                  <div key={author.sys.id} className="flex items-center gap-3">
                    {author.fields.avatar ? (
                      <img
                        src={`https:${author.fields.avatar.fields.file.url}`}
                        alt={author.fields.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {author.fields.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      {author.fields.link ? (
                        <a
                          href={author.fields.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {author.fields.name}
                        </a>
                      ) : (
                        <span className="font-medium text-foreground">{author.fields.name}</span>
                      )}
                      {author.fields.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{author.fields.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {fields.series && (
              <Link
                to={`/blog/series/${fields.series.fields.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between gap-4 group hover:bg-primary/15 hover:border-primary/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 text-primary font-medium mb-1">
                    <BookOpen className="h-4 w-4" />
                    Part of series: {fields.series.fields.title}
                  </div>
                  {fields.series.fields.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {fields.series.fields.description}
                    </p>
                  )}
                </div>
                <span className="text-primary text-sm font-medium group-hover:underline whitespace-nowrap">
                  View series →
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {fields.coverImage && (
        <section className="pt-16 md:pt-20">
          <div className="container">
            <div className="max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.05s" }}>
              <OptimizedImage
                src={`https:${fields.coverImage.fields.file.url}`}
                alt={fields.coverImage.fields.title || fields.title}
                className="rounded-xl w-full aspect-video object-cover shadow-lg"
                responsive
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <TableOfContents content={fields.content} variant="mobile" />
            <div className="flex gap-12">
              <article className="flex-1 max-w-3xl animate-fade-up overflow-x-hidden" style={{ animationDelay: "0.1s" }}>
                <BlogContent content={fields.content} />
              </article>
              <aside className="hidden lg:block w-64 shrink-0">
                <TableOfContents content={fields.content} variant="desktop" />
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {fields.sameSubjectPosts && fields.sameSubjectPosts.length > 0 && (
        <section className="py-12 md:py-16 border-t border-border">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">Related Posts</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {fields.sameSubjectPosts.map((relatedPost) => (
                  <Link key={relatedPost.sys.id} to={`/preview/${relatedPost.fields.slug}`}>
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2">
                          {relatedPost.fields.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.fields.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
