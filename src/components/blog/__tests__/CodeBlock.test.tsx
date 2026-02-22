import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CodeBlock } from "../CodeBlock";

describe("CodeBlock", () => {
  it("renders code content", () => {
    render(<CodeBlock code="const x = 1;" language="typescript" />);
    expect(screen.getByText(/const/)).toBeInTheDocument();
  });

  it("renders a pre element", () => {
    const { container } = render(<CodeBlock code="line1\nline2\nline3" language="javascript" />);
    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(pre?.textContent).toContain("line1");
    expect(pre?.textContent).toContain("line2");
  });

  it("defaults to typescript language", () => {
    const { container } = render(<CodeBlock code="const x = 1;" />);
    expect(container.querySelector("pre")).toBeInTheDocument();
  });
});
