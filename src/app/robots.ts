import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/sign-in"],
    },
    sitemap: "https://www.readysetgosafaris.com/sitemap.xml",
  };
}
