import { MetadataRoute } from "next";
import { NEXT_PUBLIC_SITE_URL } from "../config/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (NEXT_PUBLIC_SITE_URL || "https://estategold.in").replace(/\/+$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/*",
        "/login",
        "/register",
        "/my-properties",
        "/my-properties/*",
        "/profile",
        "/profile/*",
        "/forgot-password",
        "/post-property",
        "/api/*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

