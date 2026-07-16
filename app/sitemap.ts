import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sherlockholmesclub.kare.edu.in";
  
  const routes = ["", "/about", "/events", "/team", "/gallery", "/announcements", "/contact", "/join", "/developer-team"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return routes;
}
