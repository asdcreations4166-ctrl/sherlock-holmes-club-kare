import { MetadataRoute } from "next";
import { getEvents } from "@/services/clubService";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sherlockholmesclub.kare.edu.in";
  
  const staticRoutes = ["", "/about", "/events", "/team", "/gallery", "/announcements", "/contact", "/join", "/developer-team"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const events = await getEvents();
    dynamicRoutes = events.map((event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.warn("Failed to fetch dynamic events for sitemap, falling back to static routes:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
