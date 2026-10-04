"use server";

import { z } from "zod";
import type { SaveOutcome } from "@/components/admin/edit/InlineTextEditor";
import { requireAdmin } from "@/lib/auth/session";
import { readDocument, saveDocument } from "@/lib/blob/json-store";
import { refreshContent } from "@/services/content";

// Footer text is edited as one sentence; it is stored as phrases split after each comma,
// which the footer recombines per breakpoint.
const footerSentenceSchema = z
  .string()
  .transform((value) => value.replace(/\s+/g, " ").trim())
  .pipe(z.string().min(1, "푸터 문구를 입력하세요.").max(300, "푸터 문구는 300자 이하여야 합니다."));

function splitFooterSentence(sentence: string): string[] {
  return sentence
    .split(/(?<=,)\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export async function saveFooterText(expectedVersion: number, sentence: string): Promise<SaveOutcome> {
  await requireAdmin();

  const parsed = footerSentenceSchema.safeParse(sentence);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const footerLines = splitFooterSentence(parsed.data);
  if (footerLines.length > 6) return { ok: false, message: "쉼표로 나뉜 구절은 6개 이하여야 합니다." };

  const current = await readDocument("settings");
  if (!current || current.document.version !== expectedVersion) {
    return { ok: false, message: "다른 관리자가 데이터를 수정했습니다.\n최신 데이터를 다시 불러온 후 수정해주세요." };
  }

  const result = await saveDocument("settings", expectedVersion, {
    data: { ...current.document.data, footerLines },
  });
  if (!result.ok) return { ok: false, message: result.message };

  refreshContent("settings");
  return { ok: true };
}
