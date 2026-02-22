import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import BlogPost from "../BlogPost";
import { mockBlogPost } from "@/test/mocks/blog-posts";

// Mock useParams
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useParams: () => ({ slug: "test-blog-post" }) };
});

vi.mock("@/hooks/useBlogPosts", () => ({
  useBlogPost: () => ({
    data: mockBlogPost,
    isLoading: false,
    error: null,
  }),
}));

vi.mock("@/lib/contentful", () => ({
  calculateReadingTime: () => "3 min read",
}));

describe("BlogPost page", () => {
  it("renders post title", () => {
    renderWithProviders(<BlogPost />);
    expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
  });

  it("renders back to blog link", () => {
    renderWithProviders(<BlogPost />);
    const backLink = screen.getByText("Back to Blog");
    expect(backLink.closest("a")).toHaveAttribute("href", "/blog");
  });

  it("renders reading time", () => {
    renderWithProviders(<BlogPost />);
    expect(screen.getByText("3 min read")).toBeInTheDocument();
  });

  it("renders published date", () => {
    renderWithProviders(<BlogPost />);
    expect(screen.getByText("January 1, 2024")).toBeInTheDocument();
  });
});
