import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import Contact from "../Contact";

describe("Contact page", () => {
  it("renders page title", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByText("Let's Connect")).toBeInTheDocument();
  });

  it("renders email contact", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByText("Work Email")).toBeInTheDocument();
    const emailLink = screen.getByText("thomas.vandennieuwenhoff@salt-security.com").closest("a");
    expect(emailLink).toHaveAttribute("href", "mailto:thomas.vandennieuwenhoff@salt-security.com");
  });

  it("renders LinkedIn contact", () => {
    renderWithProviders(<Contact />);
    // The LinkedIn section exists
    const linkedinCards = screen.getAllByText("LinkedIn");
    expect(linkedinCards.length).toBeGreaterThan(0);
  });

  it("renders code repository links", () => {
    renderWithProviders(<Contact />);
    // GitHub and GitLab are rendered as link buttons in the code section
    const githubLinks = screen.getAllByText("GitHub");
    expect(githubLinks.length).toBeGreaterThan(0);

    const gitlabLinks = screen.getAllByText("GitLab");
    expect(gitlabLinks.length).toBeGreaterThan(0);
  });

  it("renders location info", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByText("Based in the Netherlands")).toBeInTheDocument();
  });

  it("renders CTA section with LinkedIn link", () => {
    renderWithProviders(<Contact />);
    const ctaLink = screen.getByText("Connect on LinkedIn").closest("a");
    expect(ctaLink).toHaveAttribute("href", "https://linkedin.com/in/tvdn");
    expect(ctaLink).toHaveAttribute("target", "_blank");
  });
});
