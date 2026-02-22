import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import Index from "../Index";

describe("Index page", () => {
  it("renders hero section with name", () => {
    renderWithProviders(<Index />);
    // Name appears in hero h1 and footer
    const matches = screen.getAllByText("Thomas van den Nieuwenhoff");
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders subtitle", () => {
    renderWithProviders(<Index />);
    expect(screen.getByText(/Lead Cyber Security Consultant with a passion/)).toBeInTheDocument();
  });

  it("renders CTA buttons with correct links", () => {
    renderWithProviders(<Index />);
    const learnMoreLink = screen.getByText("Learn More About Me").closest("a");
    expect(learnMoreLink).toHaveAttribute("href", "/about");

    const contactLink = screen.getByText("Get in Touch").closest("a");
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("renders highlight cards", () => {
    renderWithProviders(<Index />);
    expect(screen.getByText("Security Expert")).toBeInTheDocument();
    expect(screen.getByText("Team Leader")).toBeInTheDocument();
    expect(screen.getByText("Problem Solver")).toBeInTheDocument();
  });

  it("renders external links with correct targets", () => {
    renderWithProviders(<Index />);
    const saltLink = screen.getByText("SALT");
    expect(saltLink.closest("a")).toHaveAttribute("target", "_blank");
    expect(saltLink.closest("a")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders CTA section with contact link", () => {
    renderWithProviders(<Index />);
    const ctaLink = screen.getByText("Start a Conversation").closest("a");
    expect(ctaLink).toHaveAttribute("href", "/contact");
  });

  it("renders profile image", () => {
    renderWithProviders(<Index />);
    const img = screen.getByAltText("Thomas van den Nieuwenhoff");
    expect(img).toBeInTheDocument();
  });

  it("renders partner link", () => {
    renderWithProviders(<Index />);
    const partnerLink = screen.getByText(/My partner Sanne/);
    expect(partnerLink.closest("a")).toHaveAttribute("href", "https://www.swoodroom.nl");
  });
});
