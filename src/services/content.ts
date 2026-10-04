import { revalidateTag, unstable_cache, updateTag } from "next/cache";
import { cacheTagFor, type DataKey } from "@/config/storage";
import { readDocument } from "@/lib/blob/json-store";
import type { ContentDocuments } from "@/lib/validation/content";

// Public reads go through the Next data cache, tagged per document, so pages do not call the
// Blob API on every request. Admin code reads json-store directly (always the latest version)
// and calls one of the refresh functions after a successful save.
export function getPublishedDocument<K extends DataKey>(key: K): Promise<ContentDocuments[K] | null> {
  return unstable_cache(
    async () => (await readDocument(key))?.document ?? null,
    ["content", key],
    { tags: [cacheTagFor(key)] },
  )();
}

// From a Server Action: the admin's next render already sees the new content.
export function refreshContent(key: DataKey): void {
  updateTag(cacheTagFor(key));
}

// From a Route Handler (e.g. image upload callbacks), where updateTag is not allowed.
export function expireContent(key: DataKey): void {
  revalidateTag(cacheTagFor(key), { expire: 0 });
}
