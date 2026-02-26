import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";

describe("ScrollToTop", () => {
  it("scrolls to top on route change", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("renders nothing", () => {
    const { container } = render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe("");
  });
});
