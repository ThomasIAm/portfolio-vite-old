import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SearchModal } from "../SearchModal";

// Mock useAISearch
const mockSearch = vi.fn();
const mockClearResults = vi.fn();

vi.mock("@/hooks/useAISearch", () => ({
  useAISearch: () => ({
    results: [],
    isLoading: false,
    error: null,
    search: mockSearch,
    clearResults: mockClearResults,
  }),
}));

describe("SearchModal", () => {
  it("renders when open", () => {
    renderWithProviders(<SearchModal open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search with AI...")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    renderWithProviders(<SearchModal open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByPlaceholderText("Search with AI...")).not.toBeInTheDocument();
  });

  it("shows empty state message", () => {
    renderWithProviders(<SearchModal open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText("Start typing to search with AI")).toBeInTheDocument();
  });

  it("shows keyboard hints", () => {
    renderWithProviders(<SearchModal open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText("navigate")).toBeInTheDocument();
    expect(screen.getByText("select")).toBeInTheDocument();
    expect(screen.getByText("close")).toBeInTheDocument();
  });

  it("accepts user input", () => {
    renderWithProviders(<SearchModal open={true} onOpenChange={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search with AI...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test" } });
    expect(input.value).toBe("test");
  });

  it("renders AI Search branding", () => {
    renderWithProviders(<SearchModal open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText("AI Search")).toBeInTheDocument();
  });
});
