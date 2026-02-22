import { describe, it, expect } from "vitest";
import {
  getRouteMetadata,
  generateOgImageUrl,
  SITE_NAME,
  ROUTE_METADATA,
} from "../seo-metadata";

describe("getRouteMetadata", () => {
  it("returns correct metadata for known routes", () => {
    const home = getRouteMetadata("/");
    expect(home.type).toBe("website");
    expect(home.title).toContain("Thomas");

    const about = getRouteMetadata("/about");
    expect(about.type).toBe("profile");

    const blog = getRouteMetadata("/blog");
    expect(blog.title).toContain("Blog");
  });

  it("generates metadata for blog post routes", () => {
    const meta = getRouteMetadata("/blog/my-test-post");
    expect(meta.type).toBe("article");
    expect(meta.title).toContain("My Test Post");
  });

  it("falls back to home for unknown routes", () => {
    const meta = getRouteMetadata("/unknown-page");
    expect(meta).toEqual(ROUTE_METADATA["/"]);
  });
});

describe("generateOgImageUrl", () => {
  it("generates a valid OG image URL", () => {
    const url = generateOgImageUrl("https://tvdn.me", "Title", "Description", "website");
    expect(url).toContain("/og?");
    expect(url).toContain("title=Title");
    expect(url).toContain("type=website");
  });

  it("truncates long descriptions", () => {
    const longDesc = "a".repeat(200);
    const url = generateOgImageUrl("https://tvdn.me", "Title", longDesc, "website");
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("description")!.length).toBeLessThanOrEqual(150);
  });
});

describe("SITE_NAME", () => {
  it("is defined", () => {
    expect(SITE_NAME).toBe("Thomas van den Nieuwenhoff");
  });
});
