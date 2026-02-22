import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import Privacy from "../Privacy";

describe("Privacy page", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("# Privacy Policy\n\nYour privacy matters."),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches PRIVACY.md", () => {
    renderWithProviders(<Privacy />);
    expect(globalThis.fetch).toHaveBeenCalledWith("/PRIVACY.md");
  });

  it("renders after loading markdown", async () => {
    renderWithProviders(<Privacy />);
    await waitFor(() => {
      expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    });
  });
});
