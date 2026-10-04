"use server";

import { z } from "zod";
import type { SaveOutcome } from "@/components/admin/edit/InlineTextEditor";
import { AWARD_ACTIVITY_TYPES, AWARD_DEGREES, LIMITS } from "@/config/content";
import { updateAwards } from "@/lib/admin/content-updates";
import { firstIssue, text, uploadedImage } from "@/lib/admin/input";
import { requireAdmin } from "@/lib/auth/session";
import { idSchema } from "@/lib/validation/common";

// Award & Activity create / edit / delete (from the Home list on /admin).
// requireAdmin → validate → versioned save of awards.json → refresh the public cache.

const personInput = z.object({
  name: text("참여자 이름", 60, { required: true }),
  degree: z.enum(AWARD_DEGREES, "참여자 학위를 선택하세요."),
  role: text("참여자 역할", 60),
  profileImage: uploadedImage("awards").optional(),
});

const awardInput = z.object({
  id: idSchema,
  type: z.enum(AWARD_ACTIVITY_TYPES, "구분을 선택하세요."),
  title: text("행사·프로젝트명", 120, { required: true }),
  label: text("수상·활동 내역", 60, { required: true }),
  date: z.iso.date("날짜를 선택하세요."),
  body: text("본문", 5000),
  images: z.array(uploadedImage("awards")).max(20, "이미지는 20장 이하로 등록하세요."),
  people: z.array(personInput).max(LIMITS.awardPeople, `참여자는 최대 ${LIMITS.awardPeople}명입니다.`),
});

export type AwardInput = z.input<typeof awardInput>;

export async function saveAward(
  expectedVersion: number,
  mode: "create" | "update",
  input: AwardInput,
): Promise<SaveOutcome> {
  await requireAdmin();
  const parsed = awardInput.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };
  const award = parsed.data;
  const now = new Date().toISOString();

  return updateAwards(expectedVersion, (items) => {
    const existing = items.find((item) => item.id === award.id);
    if (mode === "create") {
      if (existing) return { error: "이미 등록된 항목입니다. 새로고침 후 다시 시도해 주세요." };
      return [...items, { ...award, createdAt: now, updatedAt: now }];
    }
    if (!existing) return { error: "삭제된 항목입니다. 새로고침 후 확인해 주세요." };
    return items.map((item) => (item.id === award.id ? { ...award, createdAt: item.createdAt, updatedAt: now } : item));
  });
}

// Removes the entry; its image files are deleted later, once no kept version references them.
export async function deleteAward(expectedVersion: number, id: string): Promise<SaveOutcome> {
  await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return { ok: false, message: "항목을 찾을 수 없습니다." };

  return updateAwards(expectedVersion, (items) => {
    if (!items.some((item) => item.id === parsed.data)) return { error: "이미 삭제된 항목입니다." };
    return items.filter((item) => item.id !== parsed.data);
  });
}
