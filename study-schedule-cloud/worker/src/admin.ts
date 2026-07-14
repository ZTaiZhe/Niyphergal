import { audit } from "./audit";
import { hashPassword, pbkdf2Iterations, type Pbkdf2Env } from "./crypto";
import { temporaryPassword } from "./protocol";
import { error, json } from "./response";
import { revokeAllSessions, type ActiveSession } from "./sessions";
import { normalizeEmail } from "./validation";

type AdminEnv = Env & Pbkdf2Env;

function requireAdmin(session: ActiveSession): Response | null {
  return session.user.role === "admin" ? null : error("NOT_FOUND", "未找到页面", 404);
}

export async function findUser(request: Request, db: D1Database, session: ActiveSession): Promise<Response> {
  const denied = requireAdmin(session); if (denied) return denied;
  let email: string; try { email = normalizeEmail(new URL(request.url).searchParams.get("email")); } catch { return error("USER_NOT_FOUND", "未找到账户", 404); }
  const row = await db.prepare("SELECT id,email_normalized email,role,status,must_change_password mustChangePassword,created_at createdAt,last_login_at lastLoginAt FROM users WHERE email_normalized=?").bind(email).first();
  return row ? json({ ok: true, user: row }) : error("USER_NOT_FOUND", "未找到账户", 404);
}

export async function userAction(request: Request, env: AdminEnv, session: ActiveSession, targetId: string, action: string): Promise<Response> {
  const db = env.DB;
  const denied = requireAdmin(session); if (denied) return denied;
  const target = await db.prepare("SELECT id,role,status FROM users WHERE id=?").bind(targetId).first<Record<string, unknown>>();
  if (!target) return error("USER_NOT_FOUND", "未找到账户", 404);
  if (targetId === session.user.id && action === "disable") return error("ADMIN_SELF_PROTECTED", "不能禁用当前管理员", 409);
  if (action === "disable" || action === "enable") {
    await db.prepare("UPDATE users SET status=?,updated_at=? WHERE id=?").bind(action === "disable" ? "disabled" : "active", Date.now(), targetId).run();
    if (action === "disable") await revokeAllSessions(db, targetId);
    await audit(db, session.user.id, targetId, action, "success", request);
    return json({ ok: true });
  }
  if (action === "revoke-sessions") {
    await revokeAllSessions(db, targetId); await audit(db, session.user.id, targetId, action, "success", request); return json({ ok: true });
  }
  if (action === "temporary-password") {
    const password = temporaryPassword();
    const digest = await hashPassword(password, pbkdf2Iterations(env));
    await db.prepare("UPDATE users SET password_hash=?,password_salt=?,password_params=?,must_change_password=1,failed_login_count=0,locked_until=NULL,updated_at=? WHERE id=?")
      .bind(digest.digest, digest.salt, JSON.stringify({ algorithm: digest.algorithm, iterations: digest.iterations }), Date.now(), targetId).run();
    await revokeAllSessions(db, targetId); await audit(db, session.user.id, targetId, action, "success", request);
    return json({ ok: true, temporaryPassword: password });
  }
  return error("NOT_FOUND", "未找到页面", 404);
}

export async function auditLog(db: D1Database, session: ActiveSession): Promise<Response> {
  const denied = requireAdmin(session); if (denied) return denied;
  const rows = await db.prepare("SELECT id,actor_user_id actorUserId,target_user_id targetUserId,action,result,source_hint sourceHint,created_at createdAt FROM audit_logs ORDER BY created_at DESC LIMIT 200").all();
  return json({ ok: true, entries: rows.results });
}
