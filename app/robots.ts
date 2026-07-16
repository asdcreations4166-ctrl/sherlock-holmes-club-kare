import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/", // Keep admin private
    },
    sitemap: "https://sherlockholmesclub.kare.edu.in/sitemap.xml",
  };
}
