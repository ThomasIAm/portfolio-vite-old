import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { Footer } from "../Footer";

describe("Footer", () => {
  it("renders the name and title", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText("Thomas van den Nieuwenhoff")).toBeInTheDocument();
    expect(screen.getByText("Lead Cyber Security Consultant")).toBeInTheDocument();
  });

  it("renders social links with correct hrefs", () => {
    renderWithProviders(<Footer />);
    const linkedinLink = screen.getByLabelText("LinkedIn");
    expect(linkedinLink).toHaveAttribute("href", "https://www.linkedin.com/in/tvdn");
    expect(linkedinLink).toHaveAttribute("target", "_blank");

    const githubLink = screen.getByLabelText("GitHub");
    expect(githubLink).toHaveAttribute("href", "https://github.com/ThomasIAm");

    const gitlabLink = screen.getByLabelText("GitLab");
    expect(gitlabLink).toHaveAttribute("href", "https://gitlab.com/ThomasIAm");

    const emailLink = screen.getByLabelText("Email");
    expect(emailLink).toHaveAttribute("href", "mailto:thomas.vandennieuwenhoff@salt-security.com");
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
    expect(screen.getByText(`© ${year} Thomas van den Nieuwenhoff`)).toBeInTheDocument();
  });

  it("edit link uses correct route-to-file mapping", () => {
    renderWithProviders(<Footer />);
    const editLink = screen.getByText("Edit on GitHub").closest("a");
    expect(editLink?.getAttribute("href")).toContain("github.com/ThomasIAm/portfolio-vite");
  });
});
