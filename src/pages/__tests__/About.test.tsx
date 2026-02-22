import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import About from "../About";

describe("About page", () => {
  it("renders page title", () => {
    renderWithProviders(<About />);
    expect(screen.getByText("About Me")).toBeInTheDocument();
  });

  it("renders journey section", () => {
    renderWithProviders(<About />);
    expect(screen.getByText("My Journey")).toBeInTheDocument();
  });

  it("renders values section", () => {
    renderWithProviders(<About />);
    expect(screen.getByText("Continuous Learning")).toBeInTheDocument();
    expect(screen.getByText("Team Growth")).toBeInTheDocument();
    expect(screen.getByText("Clear Communication")).toBeInTheDocument();
  });

  it("renders certifications section", () => {
    renderWithProviders(<About />);
    expect(screen.getByText(/Certifications/)).toBeInTheDocument();
  });

  it("renders profile image", () => {
    renderWithProviders(<About />);
    const img = screen.getByAltText("Thomas van den Nieuwenhoff");
    expect(img).toBeInTheDocument();
  });
});
