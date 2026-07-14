import { constantTimeTextEqual, hashPassword, pbkdf2Iterations, verifyPassword, type PasswordDigest, type Pbkdf2Env } from "./crypto";
import { audit } from "./audit";
import { createSession, revokeAllSessions, type ActiveSession } from "./sessions";
import { error, json } from "./response";
import { normalizeEmail, validatePassword } from "./validation";

type AuthEnv = Env & Pbkdf2Env & { BOOTSTRAP_INVITE: string };
type AuthBody = { email?: unknown; password?: unknown; invite?: unknown; remember?: unknown; newPassword?: unknown };

function passwordRecord(row: Record<string, unknown>): PasswordDigest {
  const params = JSON.parse(String(row.password_params)) as { algorithm: "PBKDF2-SHA-256"; iterations: number };
  return { ...params, salt: String(row.password_salt), digest: String(row.password_hash) };
}

async function userInsert(env: AuthEnv, email: string, password: string, role: "admin" | "user", onlyIfUninitialized = false): Promise<{ id: string; statement: D1PreparedStatement }> {
  const id = crypto.randomUUID();
  const now = Date.now();
  const digest = await hashPassword(password, pbkdf2Iterations(env));
  const sql = onlyIfUninitialized
    ? "INSERT INTO users (id,email_normalized,password_hash,password_salt,password_params,role,created_at,updated_at) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM bootstrap_state WHERE id=1 AND admin_user_id IS NULL)"
    : "INSERT INTO users (id,email_normalized,password_hash,password_salt,password_params,role,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)";
  const statement = env.DB.prepare(sql).bind(id, email, digest.digest, digest.salt, JSON.stringify({ algorithm: digest.algorithm, iterations: digest.iterations }), role, now, now);
  return { id, statement };
}

export async function bootstrapRegister(request: Request, env: AuthEnv, body: AuthBody): Promise<Response> {
  let email: string;
  try { email = normalizeEmail(body.email); validatePassword(body.password); } catch { return error("REGISTER_INVALID", "注册信息无效", 400); }
  if (typeof body.invite !== "string" || !(await constantTimeTextEqual(body.invite, env.BOOTSTRAP_INVITE))) return error("REGISTER_INVALID", "注册信息无效", 400);
  const state = await env.DB.prepare("SELECT admin_user_id FROM bootstrap_state WHERE id=1").first<{ admin_user_id: string | null }>();
  if (state?.admin_user_id) return error("BOOTSTRAP_COMPLETE", "初始化已完成", 409);
  try {
    const user = await userInsert(env, email, String(body.password), "admin", true);
    const userId = user.id;
    await env.DB.batch([
      user.statement,
      env.DB.prepare("UPDATE bootstrap_state SET initialized_at=?,admin_user_id=? WHERE id=1 AND admin_user_id IS NULL").bind(Date.now(), userId),
    ]);
    const session = await createSession(env.DB, userId, Boolean(body.remember));
    await audit(env.DB, userId, userId, "bootstrap-register", "success", request);
    return json({ ok: true, user: { id: userId, email, role: "admin", mustChangePassword: false }, csrfToken: session.csrfToken }, 201, { "Set-Cookie": session.cookie });
  } catch {
    const completed = await env.DB.prepare("SELECT admin_user_id FROM bootstrap_state WHERE id=1").first<{ admin_user_id: string | null }>();
    if (completed?.admin_user_id) return error("BOOTSTRAP_COMPLETE", "初始化已完成", 409);
    return error("REGISTER_INVALID", "注册信息无效", 400);
  }
}

export async function register(request: Request, env: AuthEnv, body: AuthBody): Promise<Response> {
  let email: string;
  try { email = normalizeEmail(body.email); validatePassword(body.password); } catch { return error("REGISTER_INVALID", "注册信息无效", 400); }
  const initialized = await env.DB.prepare("SELECT admin_user_id FROM bootstrap_state WHERE id=1").first<{ admin_user_id: string | null }>();
  if (!initialized?.admin_user_id) return error("BOOTSTRAP_REQUIRED", "系统尚未初始化", 409);
  try {
    const user = await userInsert(env, email, String(body.password), "user");
    await user.statement.run();
    const userId = user.id;
    const session = await createSession(env.DB, userId, Boolean(body.remember));
    return json({ ok: true, user: { id: userId, email, role: "user", mustChangePassword: false }, csrfToken: session.csrfToken }, 201, { "Set-Cookie": session.cookie });
  } catch { return error("REGISTER_INVALID", "注册信息无效", 400); }
}

export async function login(request: Request, env: AuthEnv, body: AuthBody): Promise<Response> {
  let email: string;
  try { email = normalizeEmail(body.email); validatePassword(body.password); } catch { return error("AUTH_FAILED", "邮箱或密码错误", 401); }
  const row = await env.DB.prepare("SELECT * FROM users WHERE email_normalized=? LIMIT 1").bind(email).first<Record<string, unknown>>();
  const now = Date.now();
  if (!row || row.status !== "active" || (row.locked_until && Number(row.locked_until) > now) || !(await verifyPassword(String(body.password), passwordRecord(row)))) {
    if (row) {
      const failures = Number(row.failed_login_count) + 1;
      await env.DB.prepare("UPDATE users SET failed_login_count=?,locked_until=?,updated_at=? WHERE id=?").bind(failures, failures >= 5 ? now + 15 * 60 * 1000 : null, now, row.id).run();
    }
    return error("AUTH_FAILED", "邮箱或密码错误", 401);
  }
  await env.DB.prepare("UPDATE users SET failed_login_count=0,locked_until=NULL,last_login_at=?,updated_at=? WHERE id=?").bind(now, now, row.id).run();
  const session = await createSession(env.DB, String(row.id), Boolean(body.remember), request.headers.get("X-Device-Label") ?? undefined);
  return json({ ok: true, user: { id: row.id, email, role: row.role, mustChangePassword: Boolean(row.must_change_password) }, csrfToken: session.csrfToken }, 200, { "Set-Cookie": session.cookie });
}

export async function changePassword(request: Request, env: AuthEnv, session: ActiveSession, body: AuthBody): Promise<Response> {
  try { validatePassword(body.newPassword); } catch { return error("PASSWORD_INVALID", "新密码不符合要求", 400); }
  const digest = await hashPassword(String(body.newPassword), pbkdf2Iterations(env));
  await env.DB.prepare("UPDATE users SET password_hash=?,password_salt=?,password_params=?,must_change_password=0,failed_login_count=0,locked_until=NULL,updated_at=? WHERE id=?")
    .bind(digest.digest, digest.salt, JSON.stringify({ algorithm: digest.algorithm, iterations: digest.iterations }), Date.now(), session.user.id).run();
  await revokeAllSessions(env.DB, session.user.id);
  const next = await createSession(env.DB, session.user.id, false);
  await audit(env.DB, session.user.id, session.user.id, "change-password", "success", request);
  return json({ ok: true, user: { ...session.user, mustChangePassword: false }, csrfToken: next.csrfToken }, 200, { "Set-Cookie": next.cookie });
}
