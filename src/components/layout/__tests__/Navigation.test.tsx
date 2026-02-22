import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { Navigation } from "../Navigation";

describe("Navigation", () => {
  it("renders all nav links", () => {
    renderWithProviders(<Navigation />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("links point to correct routes", () => {
    renderWithProviders(<Navigation />);
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");

    const aboutLink = screen.getByText("About").closest("a");
    expect(aboutLink).toHaveAttribute("href", "/about");

    const projectsLink = screen.getByText("Projects").closest("a");
    expect(projectsLink).toHaveAttribute("href", "/projects");

    const blogLink = screen.getByText("Blog").closest("a");
    expect(blogLink).toHaveAttribute("href", "/blog");

    const contactLink = screen.getByText("Contact").closest("a");
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("highlights active link", () => {
    // Home is active by default (BrowserRouter starts at /)
    renderWithProviders(<Navigation />);
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink?.className).toContain("text-primary");
  });
});
