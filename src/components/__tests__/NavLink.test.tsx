import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { NavLink } from "../NavLink";

describe("NavLink", () => {
  it("renders with correct href", () => {
    renderWithProviders(<NavLink to="/about">About</NavLink>);
    const link = screen.getByText("About");
    expect(link.closest("a")).toHaveAttribute("href", "/about");
  });

  it("applies active class when active", () => {
    // Render at root, link to "/" should be active
    renderWithProviders(
      <NavLink to="/" activeClassName="active-class" className="base">
        Home
      </NavLink>
    );
    const link = screen.getByText("Home").closest("a");
    expect(link?.className).toContain("active-class");
  });
});
