import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import Notice from "../Notice";

describe("Notice page", () => {
  it("renders title", () => {
    renderWithProviders(<Notice />);
    expect(screen.getByText("Notice & Attributions")).toBeInTheDocument();
  });

  it("renders Lovable shoutout", () => {
    renderWithProviders(<Notice />);
    expect(screen.getByText("Built with Lovable")).toBeInTheDocument();
    const lovableLink = screen.getByText("Check out Lovable");
    expect(lovableLink.closest("a")).toHaveAttribute("href", "https://lovable.dev");
  });

  it("renders dependency list", () => {
    renderWithProviders(<Notice />);
    expect(screen.getByText("React 19")).toBeInTheDocument();
    expect(screen.getByText("Vite")).toBeInTheDocument();
    expect(screen.getByText("Tailwind CSS 4")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders license information section", () => {
    renderWithProviders(<Notice />);
    expect(screen.getByText("License Information")).toBeInTheDocument();
  });

  it("dependency links open in new tab", () => {
    renderWithProviders(<Notice />);
    const reactLink = screen.getByText("React 19").closest("a");
    expect(reactLink).toHaveAttribute("target", "_blank");
    expect(reactLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
