import type { MetadataRoute } from "next";

// This is a class yearbook, not a public site: ask crawlers to stay out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
