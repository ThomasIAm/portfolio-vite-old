import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar, Clock, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { calculateReadingTime } from "@/lib/contentful";
import { format } from "date-fns";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const INITIAL_POSTS_COUNT = 5;

export default function Blog() {
  const { data: posts, isLoading, error } = useBlogPosts();
  const [showAll, setShowAll] = useState(false);
  
  const featuredPosts = posts?.filter((post) => post.fields.featured) || [];
  const allPosts = posts || [];
  const visiblePosts = showAll ? allPosts : allPosts.slice(0, INITIAL_POSTS_COUNT);

  return (
    <Layout>
      <SEO
        title="Blog"
        description={siteConfig.seo.blogDescription}
        canonical="/blog"
        keywords={[
          "cyber security blog",
          "security articles",
          "Cloudflare insights",
          "Zero Trust architecture",
          "DevSecOps",
        ]}
      />
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Thoughts on cyber security, leadership, and navigating the digital
              landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts Carousel */}
      {featuredPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
              Featured Posts
            </h2>
            <Carousel
              opts={{
                align: "start",
                loop: featuredPosts.length > 1,
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent className="-ml-4">
                {featuredPosts.map((post) => {
                  const fields = post.fields;
                  const readingTime = calculateReadingTime(fields.content);
                  const coverImageUrl = fields.coverImage?.fields?.file?.url
                    ? `https:${fields.coverImage.fields.file.url}`
                    : null;

                  return (
                    <CarouselItem key={post.sys.id} className="pl-4 basis-[85%] sm:basis-[85%] md:basis-1/2 lg:basis-1/2">
                      <Link to={`/blog/${fields.slug}`} className="block h-full">
                        <article className="h-full rounded-2xl bg-card shadow-soft overflow-hidden group hover:shadow-md transition-shadow">
                          {coverImageUrl && (
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={coverImageUrl}
                                alt={fields.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                              Featured
                            </span>
                            <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {fields.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {fields.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(fields.publishedDate), "MMM d, yyyy")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {readingTime}
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              {featuredPosts.length > 1 && (
                <>
                  <CarouselPrevious className="hidden md:flex -left-12" />
                  <CarouselNext className="hidden md:flex -right-12" />
                </>
              )}
            </Carousel>
          </div>
        </section>
      )}

      {/* Blog Posts */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {isLoading && (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-8 rounded-2xl bg-card shadow-soft animate-pulse"
                  >
                    <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                    <div className="h-4 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="p-8 rounded-2xl bg-card shadow-soft text-center">
                <p className="text-muted-foreground">
                  Unable to load blog posts. Please check your configuration.
                </p>
              </div>
            )}

            {posts && posts.length === 0 && (
              <article className="p-8 rounded-2xl bg-card shadow-soft animate-fade-up">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Coming Soon
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Blog Posts Coming Soon
                </h2>
                <p className="text-muted-foreground text-lg">
                  I'm working on some exciting content about cyber security,
                  team leadership, and the intersection of technology and
                  business. Stay tuned for insights from the field.
                </p>
              </article>
            )}

            {allPosts.length > 0 && (
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                All Posts
              </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePosts.map((post, index) => {
                const fields = post.fields;
                const readingTime = calculateReadingTime(fields.content);
                const isFeatured = post.fields.featured;

                return (
                  <article
                    key={post.sys.id}
                    className="p-6 rounded-2xl bg-card shadow-soft animate-fade-up hover:shadow-md transition-shadow flex flex-col h-full"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    {isFeatured && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2 w-fit">
                        Featured
                      </span>
                    )}
                    <Link to={`/blog/${fields.slug}`}>
                      <h2 className="font-display text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors line-clamp-2">
                        {fields.title}
                      </h2>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                      {fields.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(fields.publishedDate), "MMM d")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {readingTime}
                        </span>
                      </div>
                      <Link
                        to={`/blog/${fields.slug}`}
                        className="inline-flex items-center text-primary font-medium hover:underline"
                      >
                        Read
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {allPosts.length > INITIAL_POSTS_COUNT && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAll(!showAll)}
                  className="gap-2"
                >
                  {showAll ? "Show Less" : `Show More (${allPosts.length - INITIAL_POSTS_COUNT} more)`}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
                </Button>
              </div>
            )}

            {/* Newsletter Signup */}
            <div
              className="mt-16 p-8 rounded-2xl bg-muted/50 text-center animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Want to be notified when new posts are published?
              </h3>
              <p className="text-muted-foreground mb-6">
                Connect with me on LinkedIn or check back here regularly for
                updates.
              </p>
              <a
                href={siteConfig.social.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                Follow on LinkedIn
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
