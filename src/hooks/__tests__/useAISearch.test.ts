import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAISearch } from "../useAISearch";

describe("useAISearch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with empty state", () => {
    const { result } = renderHook(() => useAISearch());
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("clears results", () => {
    const { result } = renderHook(() => useAISearch());
    act(() => {
      result.current.clearResults();
    });
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("does not search for empty query", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useAISearch());
    await act(async () => {
      await result.current.search("");
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("handles search error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useAISearch());
    await act(async () => {
      await result.current.search("test query");
    });
    expect(result.current.error).toBe("Network error");
    expect(result.current.results).toEqual([]);
  });

  it("handles successful search", async () => {
    const mockData = {
      data: [
        { file_id: "1", filename: "test.md", score: 0.9, content: [{ id: "1", type: "text", text: "result" }] },
      ],
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const { result } = renderHook(() => useAISearch());
    await act(async () => {
      await result.current.search("test");
    });
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].filename).toBe("test.md");
  });

  it("handles HTTP error response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Bad request" }),
    } as Response);

    const { result } = renderHook(() => useAISearch());
    await act(async () => {
      await result.current.search("test");
    });
    expect(result.current.error).toBe("Bad request");
  });
});
