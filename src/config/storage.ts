// Vercel Blob layout. Live data lives only in Blob, never in the repository.
//
// Each JSON document is stored as immutable versions: data/<key>/v000001.json, v000002.json, ...
// A public store's CDN keeps serving the old content of an overwritten URL (for up to the
// 30-day cache lifetime), so a document is never overwritten — every save creates a new file.

export const DATA_KEYS = ["home", "awards", "projects", "professor", "members", "settings"] as const;

export type DataKey = (typeof DATA_KEYS)[number];

export const dataPrefix = (key: DataKey) => `data/${key}/`;

export const dataVersionPath = (key: DataKey, version: number) =>
  `${dataPrefix(key)}v${String(version).padStart(6, "0")}.json`;

// Parses the version from a path made by dataVersionPath; null for anything else.
export function parseDataVersion(key: DataKey, pathname: string): number | null {
  const match = pathname.slice(dataPrefix(key).length).match(/^v(\d{6,})\.json$/);
  return pathname.startsWith(dataPrefix(key)) && match ? Number(match[1]) : null;
}

// Versions kept per document; older ones are deleted after each save. Also the rollback window.
export const DATA_HISTORY_LIMIT = 10;

export const IMAGE_KINDS = ["home", "awards", "projects", "professor", "members"] as const;

export type ImageKind = (typeof IMAGE_KINDS)[number];

export const IMAGE_UPLOAD = {
  allowedTypes: {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/webp": ["webp"],
    "image/avif": ["avif"],
  },
  // Per file. Admin form and server validation both read this value.
  maxSizeBytes: 10 * 1024 * 1024,
} as const satisfies {
  allowedTypes: Record<string, readonly string[]>;
  maxSizeBytes: number;
};

export type AllowedImageType = keyof typeof IMAGE_UPLOAD.allowedTypes;

// Public pages read data through the Next data cache under these tags.
export const cacheTagFor = (key: DataKey) => `data:${key}`;
