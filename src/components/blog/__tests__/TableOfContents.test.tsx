import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { TableOfContents } from "../TableOfContents";

describe("TableOfContents", () => {
  const content = "# Heading 1\n\nSome text\n\n## Heading 2\n\nMore text\n\n### Heading 3";

  it("extracts and renders headings", () => {
    renderWithProviders(<TableOfContents content={content} variant="desktop" />);
    expect(screen.getByText("Heading 1")).toBeInTheDocument();
    expect(screen.getByText("Heading 2")).toBeInTheDocument();
    expect(screen.getByText("Heading 3")).toBeInTheDocument();
  });

  it("renders 'On this page' label", () => {
    renderWithProviders(<TableOfContents content={content} variant="desktop" />);
    expect(screen.getByText("On this page")).toBeInTheDocument();
  });

  it("returns null when no headings", () => {
    const { container } = renderWithProviders(
      <TableOfContents content="Just some text with no headings" variant="desktop" />
    );
    // When no headings, the component renders nothing meaningful
    expect(container.querySelector("nav")).not.toBeInTheDocument();
  });

  it("renders mobile variant with collapsible", () => {
    renderWithProviders(<TableOfContents content={content} variant="mobile" />);
    expect(screen.getByText("On this page")).toBeInTheDocument();
  });

  it("detects footnotes section", () => {
    const contentWithFootnotes = "# Title\n\nSome text[^1]\n\n[^1]: Footnote";
    renderWithProviders(
      <TableOfContents content={contentWithFootnotes} variant="desktop" />
    );
    expect(screen.getByText("Footnotes")).toBeInTheDocument();
  });
});
