export const SITE = {
  name: "A2F Design Lab",
  // Fallback is empty so a missing value is visible rather than pointing somewhere wrong.
  publicationUrl: process.env.NOTION_PUBLICATION_URL ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
} as const;
