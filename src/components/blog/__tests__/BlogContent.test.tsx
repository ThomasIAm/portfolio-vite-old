import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { BlogContent } from "../BlogContent";

// Mock shiki so code blocks render synchronously
vi.mock("shiki", () => ({
  createHighlighter: vi.fn().mockResolvedValue({
    codeToHtml: vi.fn().mockImplementation((code: string) =>
      `<pre class="shiki"><code><span class="line">${code}</span></code></pre>`
    ),
  }),
}));

describe("BlogContent", () => {
  it("renders markdown headings", () => {
    renderWithProviders(<BlogContent content="# Hello World" />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders paragraphs", () => {
    renderWithProviders(<BlogContent content="This is a paragraph." />);
    expect(screen.getByText("This is a paragraph.")).toBeInTheDocument();
  });

  it("renders inline links", () => {
    renderWithProviders(
      <BlogContent content="Visit [here](https://example.com) for info." />
    );
    const link = screen.getByText("here");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders list content", () => {
    const { container } = renderWithProviders(<BlogContent content="- Apple\n- Banana" />);
    expect(container.textContent).toContain("Apple");
    expect(container.textContent).toContain("Banana");
  });

  it("renders ordered list content", () => {
    const { container } = renderWithProviders(<BlogContent content="1. First\n2. Second" />);
    expect(container.textContent).toContain("First");
    expect(container.textContent).toContain("Second");
  });

  it("renders inline code", () => {
    renderWithProviders(<BlogContent content="Use `console.log`" />);
    expect(screen.getByText("console.log")).toBeInTheDocument();
  });

  it("renders code blocks with shiki", async () => {
    renderWithProviders(
      <BlogContent content={'```typescript\nconst x = 1;\n```'} />
    );
    // Code block is async (shiki loads), wait for it
    await waitFor(() => {
      expect(screen.getByText(/const x = 1/)).toBeInTheDocument();
    });
  });

  it("renders code block with copy button", () => {
    renderWithProviders(
      <BlogContent content={'```typescript\nconst x = 1;\n```'} />
    );
    expect(screen.getByLabelText("Copy code")).toBeInTheDocument();
  });

  it("renders blockquotes", () => {
    renderWithProviders(<BlogContent content="> This is a quote" />);
    const blockquote = screen.getByText("This is a quote");
    expect(blockquote).toBeInTheDocument();
  });

  it("renders tables", () => {
    const table = "| Name | Value |\n|------|-------|\n| Foo  | Bar   |";
    renderWithProviders(<BlogContent content={table} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Foo")).toBeInTheDocument();
    expect(screen.getByText("Bar")).toBeInTheDocument();
  });

  it("renders heading anchor buttons", () => {
    renderWithProviders(<BlogContent content="## Test Heading" />);
    const button = screen.getByLabelText("Copy link to heading");
    expect(button).toBeInTheDocument();
  });

  it("renders terminal-style code blocks", () => {
    renderWithProviders(
      <BlogContent content={'```terminal\nnpm install shiki\n```'} />
    );
    // Terminal mode should show macOS dots and prompt
    expect(screen.getByText("$")).toBeInTheDocument();
  });
});
