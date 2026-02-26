import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "../CodeBlock";

// Mock shiki
vi.mock("shiki", () => ({
  createHighlighter: vi.fn().mockResolvedValue({
    codeToHtml: vi.fn().mockReturnValue(
      '<pre class="shiki"><code><span class="line">const x = 1;</span></code></pre>'
    ),
  }),
}));

// Mock clipboard
const writeTextMock = vi.fn().mockResolvedValue(undefined);
beforeEach(() => {
  writeTextMock.mockClear();
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: writeTextMock },
    writable: true,
    configurable: true,
  });
});

describe("CodeBlock", () => {
  it("renders a copy button", () => {
    render(<CodeBlock code="const x = 1;" language="typescript" />);
    expect(screen.getByLabelText("Copy code")).toBeInTheDocument();
  });

  it("displays language label in header", () => {
    render(<CodeBlock code="const x = 1;" language="typescript" />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("displays filename when provided", () => {
    render(<CodeBlock code="const x = 1;" language="typescript" filename="config.ts" />);
    expect(screen.getByText("config.ts")).toBeInTheDocument();
  });

  it("renders terminal mode with prompt symbols", async () => {
    render(<CodeBlock code="npm install shiki" terminal />);
    await waitFor(() => {
      expect(screen.getByText("$")).toBeInTheDocument();
    });
  });

  it("renders macOS dots in terminal mode", () => {
    const { container } = render(<CodeBlock code="ls" terminal />);
    const dots = container.querySelectorAll(".rounded-full");
    expect(dots.length).toBe(3);
  });

  it("copies code to clipboard on click", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" language="typescript" />);

    // Button should initially show Copy icon
    const copyButton = screen.getByLabelText("Copy code");
    await user.click(copyButton);

    // After clicking, it should show the check icon (copied state)
    await waitFor(() => {
      expect(screen.getByText("Copied")).toBeInTheDocument();
    });
  });

  it("shows shiki-highlighted HTML after loading", async () => {
    render(<CodeBlock code="const x = 1;" language="typescript" />);
    await waitFor(() => {
      expect(screen.getByText("const x = 1;")).toBeInTheDocument();
    });
  });

  it("defaults to typescript language", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });
});
