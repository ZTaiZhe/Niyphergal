import { auditLog, findUser, userAction } from "./admin";
import { bootstrapRegister, changePassword, login, register } from "./auth";
import { clearSessionCookie } from "./protocol";
import { cors, error, json } from "./response";
import { activeSession, requireCsrf, revokeAllSessions, revokeSession } from "./sessions";
import { pull, push } from "./sync";

type WorkerEnv = Env & { BOOTSTRAP_INVITE: string; ALLOWED_ORIGINS: string; PBKDF2_ITERATIONS: string };

function resolveOrigin(env: WorkerEnv, request: Request): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  const allowed = env.ALLOWED_ORIGINS.split(",").map(o => o.trim());
  return allowed.includes(origin) ? origin : null;
}

async function limited(request: Request, limiter: RateLimit, scope: string): Promise<Response | null> {
  const source = request.headers.get("CF-Connecting-IP") ?? "local";
  const outcome = await limiter.limit({ key: `${scope}:${source}` });
  return outcome.success ? null : error("RATE_LIMITED", "请求过于频繁，请稍后重试", 429);
}

async function readBody(request: Request): Promise<unknown> {
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) throw new Error("CONTENT_TYPE");
  const length = Number(request.headers.get("Content-Length") ?? "0");
  if (length > 262144) throw new Error("BODY_TOO_LARGE");
  const text = await request.text();
  if (text.length > 262144) throw new Error("BODY_TOO_LARGE");
  return JSON.parse(text || "{}");
}

async function handle(request: Request, env: WorkerEnv): Promise<Response> {
  const url = new URL(request.url);
  const origin = resolveOrigin(env, request);
  if (request.headers.get("Origin") && !origin) return error("ORIGIN_DENIED", "请求来源无效", 403);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,X-CSRF-Token,X-Device-Label" } });
  if (url.pathname.startsWith("/api/auth/") && url.pathname !== "/api/auth/session") { const denied = await limited(request, env.AUTH_RATE_LIMIT, "auth"); if (denied) return denied; }
  if (url.pathname.startsWith("/api/sync/")) { const denied = await limited(request, env.SYNC_RATE_LIMIT, "sync"); if (denied) return denied; }
  if (url.pathname.startsWith("/api/admin/")) { const denied = await limited(request, env.ADMIN_RATE_LIMIT, "admin"); if (denied) return denied; }
  if (url.pathname.endsWith("/temporary-password")) { const denied = await limited(request, env.TEMP_PASSWORD_RATE_LIMIT, "temporary-password"); if (denied) return denied; }
  let body: unknown = undefined;
  if (request.method === "POST") { try { body = await readBody(request); } catch { return error("REQUEST_INVALID", "请求无效", 400); } }
  if (url.pathname === "/api/auth/bootstrap-register" && request.method === "POST") return bootstrapRegister(request, env, body as any);
  if (url.pathname === "/api/auth/register" && request.method === "POST") return register(request, env, body as any);
  if (url.pathname === "/api/auth/login" && request.method === "POST") return login(request, env, body as any);
  if (url.pathname === "/api/debug" && request.method === "GET") return json({ bootstrap_invite_len: env.BOOTSTRAP_INVITE?.length ?? -1, pbkdf2: env.PBKDF2_ITERATIONS, allowed_origins: env.ALLOWED_ORIGINS, env_keys: Object.keys(env).filter(k => !k.startsWith("_")) });
  const session = await activeSession(request, env.DB);
  if (url.pathname === "/api/auth/session" && request.method === "GET") return session ? json({ ok: true, user: session.user }) : error("AUTH_REQUIRED", "需要登录", 401);
  if (!session) return error("AUTH_REQUIRED", "需要登录", 401);
  if (request.method === "POST" && !(await requireCsrf(request, session))) return error("CSRF_INVALID", "请求校验失败", 403);
  if (url.pathname === "/api/auth/logout" && request.method === "POST") { await revokeSession(env.DB, session.id); return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() }); }
  if (url.pathname === "/api/auth/logout-all" && request.method === "POST") { await revokeAllSessions(env.DB, session.user.id); return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() }); }
  if (url.pathname === "/api/auth/change-password" && request.method === "POST") return changePassword(request, env, session, body as any);
  if (url.pathname === "/api/sync/pull" && request.method === "GET") return pull(request, env.DB, session);
  if (url.pathname === "/api/sync/push" && request.method === "POST") return push(request, env.DB, session, body);
  if (url.pathname === "/api/admin/users" && request.method === "GET") return findUser(request, env.DB, session);
  if (url.pathname === "/api/admin/audit" && request.method === "GET") return auditLog(env.DB, session);
  const match = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/(disable|enable|revoke-sessions|temporary-password)$/);
  if (match && request.method === "POST") return userAction(request, env, session, decodeURIComponent(match[1]), match[2]);
  return error("NOT_FOUND", "未找到页面", 404);
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const origin = resolveOrigin(env, request);
    const corsOrigin = origin || env.ALLOWED_ORIGINS.split(",")[0].trim();
    try {
      const response = await handle(request, env);
      return cors(response, corsOrigin);
    } catch (cause) {
      console.error(JSON.stringify({ event: "request_error", message: cause instanceof Error ? cause.message : "unknown" }));
      return cors(error("INTERNAL_ERROR", "服务暂时不可用", 500), corsOrigin);
    }
  },
} satisfies ExportedHandler<WorkerEnv>;
