import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SearchButton } from "../SearchButton";

// Mock SearchModal to avoid complexity
vi.mock("../SearchModal", () => ({
  SearchModal: ({ open }: { open: boolean }) =>
    open ? <div data-testid="search-modal">Modal</div> : null,
}));

describe("SearchButton", () => {
  it("renders search button", () => {
    renderWithProviders(<SearchButton />);
    expect(screen.getByLabelText("Open search (Ctrl+K)")).toBeInTheDocument();
  });

  it("opens modal on click", () => {
    renderWithProviders(<SearchButton />);
    fireEvent.click(screen.getByLabelText("Open search (Ctrl+K)"));
    expect(screen.getByTestId("search-modal")).toBeInTheDocument();
  });

  it("opens modal on Ctrl+K", () => {
    renderWithProviders(<SearchButton />);
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(screen.getByTestId("search-modal")).toBeInTheDocument();
  });

  it("opens modal on Cmd+K", () => {
    renderWithProviders(<SearchButton />);
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(screen.getByTestId("search-modal")).toBeInTheDocument();
  });
});
