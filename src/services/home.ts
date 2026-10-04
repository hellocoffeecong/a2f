import type { HomeContent } from "@/types/content";
import { getPublishedDocument } from "./content";

export async function getHomeContent(): Promise<HomeContent | null> {
  const document = await getPublishedDocument("home");
  if (!document) return null;
  return {
    ...document.data,
    researchFields: document.data.researchFields.toSorted((a, b) => a.order - b.order),
  };
}
