import type { MetadataRoute } from "next";
import { projects } from "@/content/portfolio";
import { site } from "@/lib/site";

const staticRoutes = [
  "",
  "/about",
  "/projects",
  "/services",
  "/skills",
  "/ai-systems",
  "/experience",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = staticRoutes.map((route) => ({
    url: `${site.url}${route}`,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.7,
  }));
  const projectPages = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...projectPages];
}
