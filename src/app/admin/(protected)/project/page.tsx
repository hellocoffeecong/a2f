import type { Metadata } from "next";
import AdminProjectList from "@/components/admin/editors/AdminProjectList";
import ProjectPage from "@/components/public/project/ProjectPage";
import { readDocument } from "@/lib/blob/json-store";
import { sortProjectsNewestFirst } from "@/lib/utils/projects";

export const metadata: Metadata = { title: "Project 편집" };

// /admin/project = the public list (same components) with [추가] and 수정/삭제 composed in.
// Reads the latest projects.json, not the public cache.
export default async function AdminProjectListPage() {
  const document = (await readDocument("projects"))?.document;
  return (
    <ProjectPage>
      <AdminProjectList projects={sortProjectsNewestFirst(document?.items ?? [])} version={document?.version ?? 0} />
    </ProjectPage>
  );
}
