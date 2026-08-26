import { MetadataRoute } from "next";
import { NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_API_URL } from "../config/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = NEXT_PUBLIC_SITE_URL || "https://estategold.com";
  const apiUrl = NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Define verified public static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/buy`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/property-listing`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Fetch properties from public endpoint with a high limit to get all published listings
    const response = await fetch(`${apiUrl}/properties?limit=1000`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const result = await response.json();
      if (result && result.success && Array.isArray(result.data)) {
        dynamicRoutes = result.data
          .filter(
            (p: any) =>
              p._id &&
              !p.isDeleted &&
              ["approved", "active", "published"].includes(p.status)
          )
          .map((p: any) => ({
            url: `${baseUrl}/property-detail/${p._id}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(p.createdAt || Date.now()),
            changeFrequency: "weekly",
            priority: 0.6,
          }));
      }
    } else {
      console.error(
        `Failed to fetch properties for sitemap: Backend returned status ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error fetching properties for sitemap:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
