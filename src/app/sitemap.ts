
//* Utilities imports

//* Utilities imports
import { getSiteUrl } from "@/lib/site-url";

//* Types imports
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: getSiteUrl(), lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
