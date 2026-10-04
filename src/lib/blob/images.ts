import { randomUUID } from "node:crypto";
import { del } from "@vercel/blob";
import type { ImageKind } from "@/config/storage";
import { idSchema } from "@/lib/validation/common";

// images/{kind}/{entityId}/{uuid}.{ext} — the user's original file name is never used as the key.
export function createImagePathname(kind: ImageKind, entityId: string, extension: string): string {
  const id = idSchema.parse(entityId);
  return `images/${kind}/${id}/${randomUUID()}.${extension}`;
}

// Call only AFTER the JSON that stopped referencing these images has been saved,
// so a failed save can never leave data pointing at deleted files.
// Failures are logged, not thrown: an orphaned file is recoverable, lost data is not.
export async function deleteUnreferencedImages(urls: string[]): Promise<void> {
  if (urls.length === 0) return;
  try {
    await del(urls);
  } catch (error) {
    console.error("[blob] failed to delete images; they remain as orphans", { urls, error });
  }
}
