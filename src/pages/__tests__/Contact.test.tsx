import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import Contact from "../Contact";
import { siteConfig } from "@/config/site";

describe("Contact page", () => {
  it("renders page title", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByText("Let's Connect")).toBeInTheDocument();
  });

  it("renders email contact", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByText(siteConfig.contact.email.label)).toBeInTheDocument();
    const emailLink = screen.getByText(siteConfig.contact.email.address).closest("a");
    expect(emailLink).toHaveAttribute("href", `mailto:${siteConfig.contact.email.address}`);
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
    expect(screen.getByText(siteConfig.contact.location.label)).toBeInTheDocument();
  });

  it("renders CTA section with LinkedIn link", () => {
    renderWithProviders(<Contact />);
    const ctaLink = screen.getByText("Connect on LinkedIn").closest("a");
    expect(ctaLink).toHaveAttribute("href", siteConfig.social.linkedin.href);
    expect(ctaLink).toHaveAttribute("target", "_blank");
  });
});
