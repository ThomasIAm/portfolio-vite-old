import { describe, it, expect } from "vitest";
import { calculateReadingTime } from "../contentful";

describe("calculateReadingTime", () => {
  it("calculates 1 min for short content", () => {
    expect(calculateReadingTime("Hello world")).toBe("1 min read");
  });

  it("calculates correct time for longer content", () => {
    const words = Array(400).fill("word").join(" ");
    expect(calculateReadingTime(words)).toBe("2 min read");
  });

  it("handles empty content", () => {
    expect(calculateReadingTime("")).toBe("1 min read");
  });

  it("handles content with multiple whitespace", () => {
    const content = "word ".repeat(600);
    expect(calculateReadingTime(content)).toBe("3 min read");
  });
});
