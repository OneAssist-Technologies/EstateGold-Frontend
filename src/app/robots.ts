import { MetadataRoute } from "next";
import { NEXT_PUBLIC_SITE_URL } from "../config/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = NEXT_PUBLIC_SITE_URL || "https://estategold.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/login/",
        "/register/",
        "/my-properties/",
        "/profile/",
        "/forgot-password/",
        "/post-property/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
