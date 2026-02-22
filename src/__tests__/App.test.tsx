import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

vi.mock("@unhead/react", () => ({
  Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useHead: () => ({}),
}));

vi.mock("@/data/blog-posts.json", () => ({ default: [] }));

describe("App", () => {
  it("renders without crashing", () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it("renders the home page by default", () => {
    render(<App />);
    const matches = screen.getAllByText("Thomas van den Nieuwenhoff");
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders navigation", () => {
    render(<App />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });
});
