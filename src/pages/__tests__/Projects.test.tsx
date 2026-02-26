import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import Projects from "../Projects";

describe("Projects page", () => {
  it("renders page title", () => {
    renderWithProviders(<Projects />);
    expect(screen.getByText("Projects & Work")).toBeInTheDocument();
  });

  it("renders initial set of projects", () => {
    renderWithProviders(<Projects />);
    expect(screen.getByText("Lead Cloudflare Professional Services")).toBeInTheDocument();
    expect(screen.getByText("Identity Access Management")).toBeInTheDocument();
  });

  it("shows 'Show More' button", () => {
    renderWithProviders(<Projects />);
    expect(screen.getByText(/Show More/)).toBeInTheDocument();
  });

  it("shows all projects on Show More click", () => {
    renderWithProviders(<Projects />);
    fireEvent.click(screen.getByText(/Show More/));
    expect(screen.getByText("My First Website")).toBeInTheDocument();
    expect(screen.getByText(/Show Less/)).toBeInTheDocument();
  });

  it("renders project links with target blank", () => {
    renderWithProviders(<Projects />);
    const visitLinks = screen.getAllByText("Visit website");
    visitLinks.forEach((link) => {
      expect(link.closest("a")).toHaveAttribute("target", "_blank");
      expect(link.closest("a")).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("renders social profile links", () => {
    renderWithProviders(<Projects />);
    expect(screen.getByText("View GitHub Profile")).toBeInTheDocument();
    expect(screen.getByText("View GitLab Profile")).toBeInTheDocument();
    expect(screen.getByText("View LinkedIn Profile")).toBeInTheDocument();
  });

  it("renders project tags", () => {
    renderWithProviders(<Projects />);
    expect(screen.getByText("Cloudflare")).toBeInTheDocument();
    expect(screen.getByText("Leadership")).toBeInTheDocument();
  });
});
