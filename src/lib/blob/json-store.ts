import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import { DATA_KEYS, type DataKey } from "@/config/storage";
import { documentSchemas, type ContentDocuments } from "@/lib/validation/content";

// JSON content is public data shown on the public site.
const ACCESS = "public";

export const VERSION_CONFLICT_MESSAGE =
  "다른 관리자가 데이터를 수정했습니다.\n최신 데이터를 다시 불러온 후 수정해주세요.";

export type StoredDocument<K extends DataKey> = {
  document: ContentDocuments[K];
  etag: string;
};

export type SaveResult<K extends DataKey> =
  | { ok: true; document: ContentDocuments[K] }
  | { ok: false; reason: "conflict"; message: string };

// Reads from origin storage, bypassing the Blob CDN, so the result is never stale.
// Public pages add their own caching on top (see services/content).
export async function readDocument<K extends DataKey>(key: K): Promise<StoredDocument<K> | null> {
  const result = await get(DATA_KEYS[key], { access: ACCESS, useCache: false });
  if (!result || result.statusCode !== 200) return null;

  const json: unknown = await new Response(result.stream).json();
  const document = documentSchemas[key].parse(json) as ContentDocuments[K];
  return { document, etag: result.blob.etag };
}

type DocumentContent<K extends DataKey> = Omit<ContentDocuments[K], "version" | "updatedAt">;

// Saves only if the stored version still equals the version the admin started editing.
// The version check gives the user-facing conflict message; the ETag (ifMatch) makes the
// read-compare-write atomic so two simultaneous saves cannot both succeed.
export async function saveDocument<K extends DataKey>(
  key: K,
  expectedVersion: number,
  content: DocumentContent<K>,
): Promise<SaveResult<K>> {
  const current = await readDocument(key);
  const currentVersion = current?.document.version ?? 0;
  if (currentVersion !== expectedVersion) {
    return { ok: false, reason: "conflict", message: VERSION_CONFLICT_MESSAGE };
  }

  const document = documentSchemas[key].parse({
    ...content,
    version: currentVersion + 1,
    updatedAt: new Date().toISOString(),
  }) as ContentDocuments[K];

  try {
    await put(DATA_KEYS[key], JSON.stringify(document), {
      access: ACCESS,
      contentType: "application/json",
      addRandomSuffix: false,
      // First save creates the file; later saves must match the ETag that was read.
      ...(current ? { allowOverwrite: true, ifMatch: current.etag } : { allowOverwrite: false }),
    });
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) {
      return { ok: false, reason: "conflict", message: VERSION_CONFLICT_MESSAGE };
    }
    // A create-only write that fails because another admin created the file first comes back
    // as a plain BlobError with no dedicated class, so confirm by re-reading instead of
    // matching the server's message text.
    if (!current && (await readDocument(key))) {
      return { ok: false, reason: "conflict", message: VERSION_CONFLICT_MESSAGE };
    }
    throw error;
  }

  return { ok: true, document };
}
