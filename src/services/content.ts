import { unstable_cache, updateTag } from "next/cache";
import { cacheTagFor, DATA_KEYS, type DataKey } from "@/config/storage";
import { readDocument } from "@/lib/blob/json-store";
import type { ContentDocuments } from "@/lib/validation/content";

// Public reads go through the Next data cache, tagged per document. Admin saves call
// refreshContent() so the next public request reads the new Blob content.
export function getPublishedDocument<K extends DataKey>(key: K): Promise<ContentDocuments[K] | null> {
  return unstable_cache(
    async () => (await readDocument(key))?.document ?? null,
    [DATA_KEYS[key]],
    { tags: [cacheTagFor(key)] },
  )();
}

// Server Actions only (updateTag gives read-your-own-writes after an admin save).
export function refreshContent(key: DataKey): void {
  updateTag(cacheTagFor(key));
}
