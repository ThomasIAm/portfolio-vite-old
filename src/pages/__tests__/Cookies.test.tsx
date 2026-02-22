import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import Cookies from "../Cookies";

describe("Cookies page", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("# Cookie Policy\n\nWe use cookies."),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches COOKIES.md", () => {
    renderWithProviders(<Cookies />);
    expect(globalThis.fetch).toHaveBeenCalledWith("/COOKIES.md");
  });

  it("renders after loading markdown", async () => {
    renderWithProviders(<Cookies />);
    await waitFor(() => {
      expect(screen.getByText("Cookie Policy")).toBeInTheDocument();
    });
  });
});
