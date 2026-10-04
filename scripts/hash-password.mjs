// Generates ADMIN_PASSWORD_HASH for the Vercel / .env.local environment.
// Usage: npm run hash-password -- '<password>'
// Must stay in sync with src/lib/auth/password.ts (format and parameters).

import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npm run hash-password -- '<password>'");
  process.exit(1);
}

const params = { N: 16384, r: 8, p: 1 };
const salt = randomBytes(16);
const key = scryptSync(password, salt, 64, { ...params, maxmem: 64 * 1024 * 1024 });

console.log(
  ["scrypt", params.N, params.r, params.p, salt.toString("base64url"), key.toString("base64url")].join(":"),
);
