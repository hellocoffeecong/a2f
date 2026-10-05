import "server-only";
import type { SaveOutcome } from "@/components/admin/edit/InlineTextEditor";
import { DEFAULT_CONTENT } from "@/config/defaults";
import { readDocument, saveDocument, VERSION_CONFLICT_MESSAGE } from "@/lib/blob/json-store";
import { refreshContent } from "@/services/content";
import type { Award, HomeContent, Member, Professor, Project, Settings } from "@/types/content";

// Read-modify-save for admin Server Actions (call requireAdmin() and validate input first).
// The save only succeeds if the stored version is still the one the editor was opened with;
// otherwise the admin gets the conflict message and nothing is written.

const CONFLICT: SaveOutcome = { ok: false, message: VERSION_CONFLICT_MESSAGE };

// `update` returns the new data, or a message to show instead of saving.
type Update<T> = (current: T) => T | { error: string };

const isError = <T,>(value: T | { error: string }): value is { error: string } =>
  typeof value === "object" && value !== null && "error" in value;

export async function updateHome(expectedVersion: number, update: Update<HomeContent>): Promise<SaveOutcome> {
  const current = await readDocument("home");
  if ((current?.document.version ?? 0) !== expectedVersion) return CONFLICT;
  const next = update(current?.document.data ?? DEFAULT_CONTENT.home.data);
  if (isError(next)) return { ok: false, message: next.error };
  const result = await saveDocument("home", expectedVersion, { data: next });
  if (!result.ok) return { ok: false, message: result.message };
  refreshContent("home");
  return { ok: true };
}

export async function updateSettings(expectedVersion: number, update: Update<Settings>): Promise<SaveOutcome> {
  const current = await readDocument("settings");
  if ((current?.document.version ?? 0) !== expectedVersion) return CONFLICT;
  const next = update(current?.document.data ?? DEFAULT_CONTENT.settings.data);
  if (isError(next)) return { ok: false, message: next.error };
  const result = await saveDocument("settings", expectedVersion, { data: next });
  if (!result.ok) return { ok: false, message: result.message };
  refreshContent("settings");
  return { ok: true };
}

export async function updateAwards(expectedVersion: number, update: Update<Award[]>): Promise<SaveOutcome> {
  const current = await readDocument("awards");
  if ((current?.document.version ?? 0) !== expectedVersion) return CONFLICT;
  const next = update(current?.document.items ?? []);
  if (isError(next)) return { ok: false, message: next.error };
  const result = await saveDocument("awards", expectedVersion, { items: next });
  if (!result.ok) return { ok: false, message: result.message };
  refreshContent("awards");
  return { ok: true };
}

export async function updateProjects(expectedVersion: number, update: Update<Project[]>): Promise<SaveOutcome> {
  const current = await readDocument("projects");
  if ((current?.document.version ?? 0) !== expectedVersion) return CONFLICT;
  const next = update(current?.document.items ?? []);
  if (isError(next)) return { ok: false, message: next.error };
  const result = await saveDocument("projects", expectedVersion, { items: next });
  if (!result.ok) return { ok: false, message: result.message };
  refreshContent("projects");
  return { ok: true };
}

export async function updateProfessor(expectedVersion: number, update: Update<Professor>): Promise<SaveOutcome> {
  const current = await readDocument("professor");
  if ((current?.document.version ?? 0) !== expectedVersion) return CONFLICT;
  const next = update(current?.document.data ?? DEFAULT_CONTENT.professor.data);
  if (isError(next)) return { ok: false, message: next.error };
  const result = await saveDocument("professor", expectedVersion, { data: next });
  if (!result.ok) return { ok: false, message: result.message };
  refreshContent("professor");
  return { ok: true };
}

export async function updateMembers(expectedVersion: number, update: Update<Member[]>): Promise<SaveOutcome> {
  const current = await readDocument("members");
  if ((current?.document.version ?? 0) !== expectedVersion) return CONFLICT;
  const next = update(current?.document.items ?? []);
  if (isError(next)) return { ok: false, message: next.error };
  const result = await saveDocument("members", expectedVersion, { items: next });
  if (!result.ok) return { ok: false, message: result.message };
  refreshContent("members");
  return { ok: true };
}
