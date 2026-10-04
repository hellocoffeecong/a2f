import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverEnv } from "@/lib/env";
import { verifyPassword } from "./password";

// Stateless session: base64url(payload).base64url(HMAC-SHA256(payload)).
// Rotating SESSION_SECRET signs every admin out.

const COOKIE_NAME = "a2f_admin_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const LOGIN_PATH = "/admin/login";

type SessionPayload = { sub: string; exp: number };

const sign = (data: string) =>
  createHmac("sha256", serverEnv.sessionSecret()).update(data).digest("base64url");

function encodeSession(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

function decodeSession(token: string): SessionPayload | null {
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expected = Buffer.from(sign(data));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as SessionPayload;
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}

// Compare fixed-length digests so the comparison time does not reveal the username.
const sameText = (a: string, b: string) =>
  timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const usernameOk = sameText(username, serverEnv.adminUsername());
  // Always run the password check so a wrong username takes the same time.
  const passwordOk = await verifyPassword(password, serverEnv.adminPasswordHash());
  return usernameOk && passwordOk;
}

export async function createAdminSession(username: string): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encodeSession({ sub: username, exp }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = token ? decodeSession(token) : null;
  return payload ? { username: payload.sub } : null;
}

// Call at the top of every admin layout, Server Action and admin Route Handler.
// Hiding UI on the client is not authorization.
export async function requireAdmin(): Promise<{ username: string }> {
  const session = await getAdminSession();
  if (!session) redirect(LOGIN_PATH);
  return session;
}
