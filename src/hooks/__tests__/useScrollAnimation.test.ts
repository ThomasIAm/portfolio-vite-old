import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollAnimation } from "../useScrollAnimation";

describe("useScrollAnimation", () => {
  it("starts with isVisible false", () => {
    const { result } = renderHook(() => useScrollAnimation());
    expect(result.current.isVisible).toBe(false);
  });

  it("returns a ref", () => {
    const { result } = renderHook(() => useScrollAnimation());
    expect(result.current.ref).toBeDefined();
  });

  it("accepts options", () => {
    const { result } = renderHook(() =>
      useScrollAnimation({ threshold: 0.5, rootMargin: "10px", triggerOnce: false })
    );
    expect(result.current.isVisible).toBe(false);
  });
});
