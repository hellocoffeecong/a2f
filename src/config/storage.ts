// Vercel Blob layout. Live data lives only in Blob, never in the repository.

export const DATA_KEYS = {
  home: "data/home.json",
  awards: "data/awards.json",
  projects: "data/projects.json",
  professor: "data/professor.json",
  members: "data/members.json",
  settings: "data/settings.json",
} as const;

export type DataKey = keyof typeof DATA_KEYS;

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
