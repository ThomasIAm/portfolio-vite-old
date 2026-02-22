import type { BlogPost } from "@/lib/contentful";

export const mockBlogPost: BlogPost = {
  metadata: { tags: [], concepts: [] },
  sys: {
    space: { sys: { type: "Link", linkType: "Space", id: "test" } },
    type: "Entry",
    id: "post-1",
    contentType: { sys: { type: "Link", linkType: "ContentType", id: "blogPost" } },
    revision: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    publishedAt: "2024-01-01T00:00:00Z",
    firstPublishedAt: "2024-01-01T00:00:00Z",
    environment: { sys: { type: "Link", linkType: "Environment", id: "master" } },
    locale: "en-US",
  },
  fields: {
    title: "Test Blog Post",
    slug: "test-blog-post",
    excerpt: "This is a test blog post excerpt",
    content: "# Hello World\n\nThis is test content.\n\n## Second Heading\n\nMore content here.",
    publishedDate: "2024-01-01T00:00:00Z",
    featured: true,
  },
};

export const mockBlogPosts: BlogPost[] = [
  mockBlogPost,
  {
    ...mockBlogPost,
    sys: { ...mockBlogPost.sys, id: "post-2" },
    fields: {
      ...mockBlogPost.fields,
      title: "Second Post",
      slug: "second-post",
      excerpt: "Second post excerpt",
      featured: false,
    },
  },
];
