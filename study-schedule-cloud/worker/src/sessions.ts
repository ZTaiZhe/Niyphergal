import { constantTimeTextEqual, randomToken, sha256 } from "./crypto";
import { sessionCookie } from "./protocol";

export type SessionUser = { id: string; email: string; role: "user" | "admin"; status: "active" | "disabled"; mustChangePassword: boolean };
export type ActiveSession = { id: string; user: SessionUser; csrfHash: string };

export function cookieValue(request: Request, name: string): string | null {
  const cookie = request.headers.get("Cookie") ?? "";
  for (const item of cookie.split(";")) {
    const [key, ...rest] = item.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

export async function createSession(db: D1Database, userId: string, remember: boolean, deviceLabel?: string): Promise<{ cookie: string; csrfToken: string }> {
  const token = randomToken();
  const csrfToken = randomToken();
  const now = Date.now();
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
  await db.prepare("INSERT INTO sessions (id,user_id,token_hash,csrf_hash,device_label,created_at,expires_at,last_seen_at) VALUES (?,?,?,?,?,?,?,?)")
    .bind(crypto.randomUUID(), userId, await sha256(token), await sha256(csrfToken), deviceLabel?.slice(0, 80) ?? null, now, now + maxAge * 1000, now).run();
  return { cookie: sessionCookie(token, maxAge), csrfToken };
}

export async function activeSession(request: Request, db: D1Database): Promise<ActiveSession | null> {
  const token = cookieValue(request, "__Host-niypher_session");
  if (!token) return null;
  const now = Date.now();
  const row = await db.prepare("SELECT s.id,s.csrf_hash,u.id user_id,u.email_normalized,u.role,u.status,u.must_change_password FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.revoked_at IS NULL AND s.expires_at>? LIMIT 1")
    .bind(await sha256(token), now).first<Record<string, unknown>>();
  if (!row || row.status !== "active") return null;
  await db.prepare("UPDATE sessions SET last_seen_at=? WHERE id=?").bind(now, row.id).run();
  return { id: String(row.id), csrfHash: String(row.csrf_hash), user: { id: String(row.user_id), email: String(row.email_normalized), role: row.role as "user" | "admin", status: row.status as "active", mustChangePassword: Boolean(row.must_change_password) } };
}

export async function requireCsrf(request: Request, session: ActiveSession): Promise<boolean> {
  const token = request.headers.get("X-CSRF-Token");
  return Boolean(token && (await constantTimeTextEqual(await sha256(token), session.csrfHash)));
}

export async function revokeSession(db: D1Database, sessionId: string): Promise<void> {
  await db.prepare("UPDATE sessions SET revoked_at=? WHERE id=? AND revoked_at IS NULL").bind(Date.now(), sessionId).run();
}

export async function revokeAllSessions(db: D1Database, userId: string): Promise<void> {
  await db.prepare("UPDATE sessions SET revoked_at=? WHERE user_id=? AND revoked_at IS NULL").bind(Date.now(), userId).run();
}
