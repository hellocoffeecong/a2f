// Minimal Vercel Blob read/write check using a throwaway JSON file (never a real data key).
// Usage: npm run blob:test   (loads .env.local; requires Node >= 22.9 for --env-file-if-exists)
//
// Verifies: credentials, create, origin read with ETag, conditional overwrite (ifMatch),
// stale-ETag rejection, create-only collision behavior, cleanup.

import { BlobPreconditionFailedError, del, get, put } from "@vercel/blob";

const KEY = "data/_connection-test.json";
const ACCESS = "public";

const authMode =
  process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID
    ? "OIDC (VERCEL_OIDC_TOKEN + BLOB_STORE_ID)"
    : process.env.BLOB_READ_WRITE_TOKEN
      ? "read-write token (BLOB_READ_WRITE_TOKEN)"
      : "none";

const results = [];
const step = async (name, fn) => {
  try {
    const detail = await fn();
    results.push({ step: name, ok: true, detail });
  } catch (error) {
    results.push({ step: name, ok: false, detail: `${error?.constructor?.name}: ${error?.message}` });
    throw error;
  }
};

async function readFresh() {
  const result = await get(KEY, { access: ACCESS, useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return { json: await new Response(result.stream).json(), etag: result.blob.etag };
}

console.log(`Auth mode: ${authMode}`);

try {
  await step("cleanup leftovers", async () => {
    await del(KEY).catch(() => {});
    return "ok";
  });

  await step("create (allowOverwrite: false)", async () => {
    const res = await put(KEY, JSON.stringify({ version: 1 }), {
      access: ACCESS,
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: false,
    });
    return res.pathname;
  });

  let first;
  await step("read from origin (useCache: false)", async () => {
    first = await readFresh();
    if (first?.json.version !== 1) throw new Error(`unexpected content: ${JSON.stringify(first?.json)}`);
    return `version=1 etag=${first.etag}`;
  });

  await step("conditional overwrite with current ETag", async () => {
    await put(KEY, JSON.stringify({ version: 2 }), {
      access: ACCESS,
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      ifMatch: first.etag,
    });
    const now = await readFresh();
    if (now?.json.version !== 2) throw new Error("overwrite not visible on origin read");
    return `version=2 etag=${now.etag}`;
  });

  await step("overwrite with stale ETag is rejected", async () => {
    try {
      await put(KEY, JSON.stringify({ version: 99 }), {
        access: ACCESS,
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        ifMatch: first.etag,
      });
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError) return "BlobPreconditionFailedError (expected)";
      throw error;
    }
    throw new Error("stale write was accepted — ifMatch is not enforced");
  });

  await step("create-only on existing file", async () => {
    try {
      await put(KEY, JSON.stringify({ version: 0 }), {
        access: ACCESS,
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: false,
      });
    } catch (error) {
      return `rejected with ${error?.constructor?.name}: ${error?.message}`;
    }
    throw new Error("create-only write overwrote an existing file");
  });
} catch {
  // Failure already recorded; fall through to cleanup and report.
} finally {
  await del(KEY).catch(() => {});
}

console.table(results);
process.exit(results.every((r) => r.ok) ? 0 : 1);
