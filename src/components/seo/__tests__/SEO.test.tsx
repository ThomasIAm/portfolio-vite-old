import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UnheadProvider, createHead } from "@unhead/react/client";
import { MemoryRouter } from "react-router-dom";
import { SEO } from "../SEO";

function Wrapper({ children }: { children: React.ReactNode }) {
  const head = createHead();
  return (
    <UnheadProvider head={head}>
      <MemoryRouter>{children}</MemoryRouter>
    </UnheadProvider>
  );
}

describe("SEO component", () => {
  it("renders without crashing", () => {
    expect(() =>
      render(<SEO title="Test" description="Test description" />, { wrapper: Wrapper })
    ).not.toThrow();
  });

  it("renders with all props", () => {
    expect(() =>
      render(
        <SEO
          title="Test Article"
          description="Article description"
          canonical="/blog/test"
          type="article"
          publishedDate="2024-01-01"
          modifiedDate="2024-01-02"
          author="Thomas"
          keywords={["test", "article"]}
          structuredData={{ "@type": "BlogPosting" }}
        />,
        { wrapper: Wrapper }
      )
    ).not.toThrow();
  });

  it("renders with minimal props", () => {
    expect(() =>
      render(<SEO />, { wrapper: Wrapper })
    ).not.toThrow();
  });
});
