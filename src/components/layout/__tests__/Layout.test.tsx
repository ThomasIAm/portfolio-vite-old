import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { Layout } from "../Layout";

describe("Layout", () => {
  it("renders children", () => {
    renderWithProviders(
      <Layout>
        <div data-testid="child">Content</div>
      </Layout>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders navigation and footer", () => {
    renderWithProviders(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    // Navigation renders nav links
    expect(screen.getByText("Home")).toBeInTheDocument();
    // Footer renders name
    expect(screen.getByText("Thomas van den Nieuwenhoff")).toBeInTheDocument();
  });
});
