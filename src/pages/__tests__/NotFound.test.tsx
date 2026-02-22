import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import NotFound from "../NotFound";

describe("NotFound page", () => {
  it("renders 404 heading", () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders error message", () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
  });

  it("renders home link", () => {
    renderWithProviders(<NotFound />);
    const link = screen.getByText("Return to Home");
    expect(link.closest("a")).toHaveAttribute("href", "/");
  });
});
