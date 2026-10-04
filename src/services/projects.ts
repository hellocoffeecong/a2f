import type { Project, ProjectCategory } from "@/types/content";
import { getPublishedDocument } from "./content";

export type ProjectFilter = { category?: ProjectCategory; year?: number };

const yearOf = (project: Project) => Number(project.date.slice(0, 4));

// Newest first.
export async function getProjects({ category, year }: ProjectFilter = {}): Promise<Project[]> {
  const document = await getPublishedDocument("projects");
  const items = document?.items ?? [];
  return items
    .filter((item) => !category || item.category === category)
    .filter((item) => !year || yearOf(item) === year)
    .toSorted((a, b) => b.date.localeCompare(a.date));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const document = await getPublishedDocument("projects");
  return document?.items.find((item) => item.id === id) ?? null;
}

// Year filter options come from the data, never from a hardcoded list.
export async function getProjectYears(): Promise<number[]> {
  const document = await getPublishedDocument("projects");
  const years = new Set((document?.items ?? []).map(yearOf));
  return [...years].toSorted((a, b) => b - a);
}
