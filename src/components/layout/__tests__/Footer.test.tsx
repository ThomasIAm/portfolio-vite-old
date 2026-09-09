import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { Footer } from "../Footer";
import { siteConfig } from "@/config/site";

describe("Footer", () => {
  it("renders the name and title", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(siteConfig.name)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.role)).toBeInTheDocument();
  });

  it("renders social links with correct hrefs", () => {
    renderWithProviders(<Footer />);
    const linkedinLink = screen.getByLabelText("LinkedIn");
    expect(linkedinLink).toHaveAttribute("href", siteConfig.social.linkedin.href);
    expect(linkedinLink).toHaveAttribute("target", "_blank");

    const githubLink = screen.getByLabelText("GitHub");
    expect(githubLink).toHaveAttribute("href", siteConfig.social.github.href);

    const gitlabLink = screen.getByLabelText("GitLab");
    expect(gitlabLink).toHaveAttribute("href", siteConfig.social.gitlab.href);

    const emailLink = screen.getByLabelText("Email");
    expect(emailLink).toHaveAttribute("href", `mailto:${siteConfig.contact.email.address}`);
  });

  it("renders legal links", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText("Privacy")).toBeInTheDocument();
    expect(screen.getByText("Cookies")).toBeInTheDocument();
    expect(screen.getByText("Notice")).toBeInTheDocument();
  });

  it("renders GitHub action links", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText("Edit on GitHub")).toBeInTheDocument();
    expect(screen.getByText("Open Issue")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("shows current year in copyright", () => {
    renderWithProviders(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} ${siteConfig.name}`)).toBeInTheDocument();
  });

  it("edit link uses correct route-to-file mapping", () => {
    renderWithProviders(<Footer />);
    const editLink = screen.getByText("Edit on GitHub").closest("a");
    expect(editLink?.getAttribute("href")).toContain(siteConfig.repoUrl);
  });
});
