import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const DOCS = [
  "Client-Pitch-Deck",
  "Client-Executive-Summary",
  "Business-Pitch-Deck",
  "Business-Executive-Summary",
  "Admin-Pitch-Deck",
  "Admin-Executive-Summary",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...DOCS.map((d) => ({
      url: `${SITE_URL}/downloads/${d}.pdf`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
