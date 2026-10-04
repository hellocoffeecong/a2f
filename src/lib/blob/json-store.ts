import { BlobNotFoundError, del, get, head, list, put } from "@vercel/blob";
import {
  DATA_HISTORY_LIMIT,
  dataPrefix,
  dataVersionPath,
  parseDataVersion,
  type DataKey,
} from "@/config/storage";
import {
  documentSchemas,
  type ContentDocuments,
  type DocumentContent,
} from "@/lib/validation/content";

// Versioned JSON documents (see config/storage for the layout and why nothing is overwritten).
//
// - Latest version = highest version number among the files listed under data/<key>/.
//   list() goes to the Blob API, so it reflects a save immediately; each version has its own
//   URL, so the CDN can never return stale content for it.
// - A save creates data/<key>/v{n+1}.json with allowOverwrite:false. If two admins save from
//   the same version, only one create succeeds — the conflict check is atomic at the store.
// - After a save, versions beyond DATA_HISTORY_LIMIT are deleted. The kept versions are the
//   rollback window; a rollback saves an old version's content as a new version.

const ACCESS = "public";

export const VERSION_CONFLICT_MESSAGE =
  "다른 관리자가 데이터를 수정했습니다.\n최신 데이터를 다시 불러온 후 수정해주세요.";

export type StoredDocument<K extends DataKey> = {
  document: ContentDocuments[K];
  pathname: string;
};

export type SaveResult<K extends DataKey> =
  | { ok: true; document: ContentDocuments[K] }
  | { ok: false; reason: "conflict"; message: string };

export type DocumentVersion = {
  version: number;
  pathname: string;
  url: string;
  uploadedAt: Date;
};

// Newest first.
export async function listDocumentVersions(key: DataKey): Promise<DocumentVersion[]> {
  const versions: DocumentVersion[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: dataPrefix(key), cursor, limit: 1000 });
    for (const blob of page.blobs) {
      const version = parseDataVersion(key, blob.pathname);
      if (version !== null) {
        versions.push({ version, pathname: blob.pathname, url: blob.url, uploadedAt: blob.uploadedAt });
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return versions.toSorted((a, b) => b.version - a.version);
}

async function fetchVersion<K extends DataKey>(key: K, entry: DocumentVersion): Promise<StoredDocument<K>> {
  const result = await get(entry.url, { access: ACCESS });
  if (!result || result.statusCode !== 200) {
    throw new Error(`Cannot read ${entry.pathname}`);
  }
  const json: unknown = await new Response(result.stream).json();
  const document = documentSchemas[key].parse(json) as ContentDocuments[K];
  if (document.version !== entry.version) {
    throw new Error(`${entry.pathname} contains version ${document.version}`);
  }
  return { document, pathname: entry.pathname };
}

// Latest version, or null if the document has never been saved.
export async function readDocument<K extends DataKey>(key: K): Promise<StoredDocument<K> | null> {
  const [latest] = await listDocumentVersions(key);
  return latest ? fetchVersion(key, latest) : null;
}

export async function readDocumentVersion<K extends DataKey>(
  key: K,
  version: number,
): Promise<StoredDocument<K> | null> {
  const entry = (await listDocumentVersions(key)).find((item) => item.version === version);
  return entry ? fetchVersion(key, entry) : null;
}

// Saves only if the latest stored version still equals the version the admin started editing.
export async function saveDocument<K extends DataKey>(
  key: K,
  expectedVersion: number,
  content: DocumentContent<K>,
): Promise<SaveResult<K>> {
  const versions = await listDocumentVersions(key);
  const currentVersion = versions[0]?.version ?? 0;
  if (currentVersion !== expectedVersion) {
    return { ok: false, reason: "conflict", message: VERSION_CONFLICT_MESSAGE };
  }

  const nextVersion = currentVersion + 1;
  const document = documentSchemas[key].parse({
    ...content,
    version: nextVersion,
    updatedAt: new Date().toISOString(),
  }) as ContentDocuments[K];
  const pathname = dataVersionPath(key, nextVersion);

  try {
    await put(pathname, JSON.stringify(document), {
      access: ACCESS,
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: false,
    });
  } catch (error) {
    // Losing the race to create this version comes back as a plain BlobError with no
    // dedicated class; confirm with head() instead of matching the server's message text.
    if (await exists(pathname)) {
      return { ok: false, reason: "conflict", message: VERSION_CONFLICT_MESSAGE };
    }
    throw error;
  }

  // The list read before saving plus the new version is the full set (a concurrent save of
  // the same version would have failed above), so no second list call is needed.
  await pruneVersions(key, versions);
  return { ok: true, document };
}

// Rollback: saves the content of an older kept version as a new latest version.
export async function restoreDocumentVersion<K extends DataKey>(
  key: K,
  fromVersion: number,
  expectedVersion: number,
): Promise<SaveResult<K>> {
  const source = await readDocumentVersion(key, fromVersion);
  if (!source) throw new Error(`Version ${fromVersion} of ${key} is no longer kept`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip metadata; save sets new values
  const { version, updatedAt, ...content } = source.document;
  return saveDocument(key, expectedVersion, content as DocumentContent<K>);
}

// Deletes versions beyond DATA_HISTORY_LIMIT, counting the version just created.
// Best effort: a failed delete only leaves an extra old version behind.
async function pruneVersions(key: DataKey, previousVersions: DocumentVersion[]): Promise<void> {
  const stale = previousVersions.slice(DATA_HISTORY_LIMIT - 1);
  if (stale.length === 0) return;
  try {
    await del(stale.map((entry) => entry.url));
  } catch (error) {
    console.error(`[blob] failed to prune old versions of ${key}`, error);
  }
}

async function exists(pathname: string): Promise<boolean> {
  try {
    await head(pathname);
    return true;
  } catch (error) {
    if (error instanceof BlobNotFoundError) return false;
    throw error;
  }
}
