// Server-only secrets. Read lazily so a missing value fails the request that needs it,
// not the whole build.

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const serverEnv = {
  adminUsername: () => required("ADMIN_USERNAME"),
  adminPasswordHash: () => required("ADMIN_PASSWORD_HASH"),
  sessionSecret: () => {
    const secret = required("SESSION_SECRET");
    if (secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
    return secret;
  },
};
