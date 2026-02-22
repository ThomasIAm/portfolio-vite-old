import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import Blog from "../Blog";
import { mockBlogPosts } from "@/test/mocks/blog-posts";

// Mock the entire useBlogPosts module
vi.mock("@/hooks/useBlogPosts", () => ({
  useBlogPosts: () => ({
    data: mockBlogPosts,
    isLoading: false,
    error: null,
    isSuccess: true,
  }),
}));

vi.mock("@/lib/contentful", async () => {
  const actual = await vi.importActual("@/lib/contentful");
  return {
    ...actual,
    calculateReadingTime: () => "3 min read",
  };
});

describe("Blog page", () => {
  it("renders page title", () => {
    renderWithProviders(<Blog />);
    expect(screen.getByRole("heading", { level: 1, name: "Blog" })).toBeInTheDocument();
  });

  it("renders blog post titles", () => {
    renderWithProviders(<Blog />);
    // Post titles may appear in both featured carousel and all posts
    const testPostMatches = screen.getAllByText("Test Blog Post");
    expect(testPostMatches.length).toBeGreaterThan(0);
  });

  it("renders post excerpts", () => {
    renderWithProviders(<Blog />);
    const excerptMatches = screen.getAllByText("This is a test blog post excerpt");
    expect(excerptMatches.length).toBeGreaterThan(0);
  });

  it("renders featured posts section", () => {
    renderWithProviders(<Blog />);
    const featuredBadges = screen.getAllByText("Featured");
    expect(featuredBadges.length).toBeGreaterThan(0);
  });

  it("renders LinkedIn follow link", () => {
    renderWithProviders(<Blog />);
    const linkedinLink = screen.getByText("Follow on LinkedIn");
    expect(linkedinLink.closest("a")).toHaveAttribute("href", "https://linkedin.com/in/tvdn");
    expect(linkedinLink.closest("a")).toHaveAttribute("target", "_blank");
  });

  it("renders reading time", () => {
    renderWithProviders(<Blog />);
    const readingTimes = screen.getAllByText("3 min read");
    expect(readingTimes.length).toBeGreaterThan(0);
  });

  it("renders blog post links to articles", () => {
    renderWithProviders(<Blog />);
    const readLinks = screen.getAllByText("Read");
    expect(readLinks.length).toBeGreaterThan(0);
    readLinks.forEach(link => {
      expect(link.closest("a")?.getAttribute("href")).toMatch(/^\/blog\//);
    });
  });
});
