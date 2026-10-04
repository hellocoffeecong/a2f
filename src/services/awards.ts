import type { Award, AwardActivityType } from "@/types/content";
import { getPublishedDocument } from "./content";

// Newest first.
export async function getAwards(type?: AwardActivityType): Promise<Award[]> {
  const document = await getPublishedDocument("awards");
  const items = document?.items ?? [];
  return items
    .filter((item) => !type || item.type === type)
    .toSorted((a, b) => b.date.localeCompare(a.date));
}

export async function getAwardById(id: string): Promise<Award | null> {
  const document = await getPublishedDocument("awards");
  return document?.items.find((item) => item.id === id) ?? null;
}
