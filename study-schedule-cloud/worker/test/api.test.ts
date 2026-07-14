import { SELF, applyD1Migrations, env } from "cloudflare:test";
import { beforeAll, describe, expect, test } from "vitest";

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {
    BOOTSTRAP_INVITE: string;
    TEST_MIGRATIONS: D1Migration[];
  }
}

beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});

function request(path: string, body?: unknown, cookie?: string, csrf?: string): Promise<Response> {
  const headers = new Headers({ Origin: "http://localhost:4173" });
  if (body !== undefined) headers.set("Content-Type", "application/json");
  if (cookie) headers.set("Cookie", cookie);
  if (csrf) headers.set("X-CSRF-Token", csrf);
  return SELF.fetch(`http://worker.test${path}`, { method: body === undefined ? "GET" : "POST", headers, body: body === undefined ? undefined : JSON.stringify(body) });
}

async function json(response: Response): Promise<any> {
  return response.json();
}

describe("authentication, sync and administration", () => {
  test("bootstrap rolls back the user when claiming bootstrap state fails", async () => {
    await env.DB.batch([
      env.DB.prepare("CREATE TRIGGER reject_bootstrap_claim BEFORE UPDATE OF admin_user_id ON bootstrap_state BEGIN SELECT RAISE(ABORT, 'claim rejected'); END"),
      env.DB.prepare("CREATE TRIGGER reject_bootstrap_cleanup BEFORE DELETE ON users BEGIN SELECT RAISE(ABORT, 'cleanup rejected'); END"),
    ]);
    const response = await request("/api/auth/bootstrap-register", {
      email: "failed-bootstrap@niypher.com",
      password: "correct horse battery staple",
      invite: "test-bootstrap-invite",
      remember: false,
    });
    expect(response.status).toBe(400);
    const residual = await env.DB.prepare("SELECT id FROM users WHERE email_normalized=?").bind("failed-bootstrap@niypher.com").first();
    await env.DB.batch([
      env.DB.prepare("DROP TRIGGER reject_bootstrap_claim"),
      env.DB.prepare("DROP TRIGGER reject_bootstrap_cleanup"),
    ]);
    expect(residual).toBeNull();
  });

  test("concurrent bootstrap claims leave exactly one administrator and no residual admin user", async () => {
    const password = "correct horse battery staple";
    const [first, second] = await Promise.all([
      request("/api/auth/bootstrap-register", { email: "admin@niypher.com", password, invite: "test-bootstrap-invite", remember: false }),
      request("/api/auth/bootstrap-register", { email: "other@niypher.com", password, invite: "test-bootstrap-invite", remember: false }),
    ]);
    expect([first.status, second.status].sort()).toEqual([201, 409]);
    const winner = first.status === 201 ? first : second;
    const loser = first.status === 409 ? first : second;
    expect(winner.headers.get("Set-Cookie")).toContain("__Host-niypher_session=");
    expect((await json(loser)).error.code).toBe("BOOTSTRAP_COMPLETE");

    const admins = await env.DB.prepare("SELECT id,email_normalized,password_params FROM users WHERE role='admin'").all<Record<string, unknown>>();
    const state = await env.DB.prepare("SELECT admin_user_id FROM bootstrap_state WHERE id=1").first<{ admin_user_id: string }>();
    expect(admins.results).toHaveLength(1);
    expect(state?.admin_user_id).toBe(admins.results[0].id);
    expect(JSON.parse(String(admins.results[0].password_params)).iterations).toBe(1000);
  });

  test("registers a normal user, authenticates a session and rejects invalid origins", async () => {
    const registered = await request("/api/auth/register", { email: "user@niypher.com", password: "another correct horse battery staple", remember: true });
    expect(registered.status).toBe(201);
    const stored = await env.DB.prepare("SELECT password_params FROM users WHERE email_normalized=?").bind("user@niypher.com").first<{ password_params: string }>();
    expect(JSON.parse(stored!.password_params).iterations).toBe(1000);
    const login = await request("/api/auth/login", { email: "user@niypher.com", password: "another correct horse battery staple", remember: false });
    expect(login.status).toBe(200);
    const loginBody = await json(login);
    const cookie = login.headers.get("Set-Cookie")!.split(";", 1)[0];
    const session = await request("/api/auth/session", undefined, cookie);
    expect((await json(session)).user.email).toBe("user@niypher.com");
    expect(loginBody.csrfToken).toMatch(/^[A-Za-z0-9_-]+$/);
    const badOrigin = await SELF.fetch("http://worker.test/api/auth/login", { method: "POST", headers: { Origin: "https://evil.example", "Content-Type": "application/json" }, body: JSON.stringify({ email: "user@niypher.com", password: "another correct horse battery staple" }) });
    expect(badOrigin.status).toBe(403);
  });

  test("push is idempotent, detects CAS conflicts and keeps tombstones", async () => {
    const login = await request("/api/auth/login", { email: "user@niypher.com", password: "another correct horse battery staple", remember: false });
    const auth = await json(login);
    const cookie = login.headers.get("Set-Cookie")!.split(";", 1)[0];
    const record = { namespace: "course", recordKey: "1:U1:0-20", value: { status: "done" }, clientUpdatedAt: 10, deviceId: "device-a", knownServerVersion: 0, deleted: false };
    const first = await request("/api/sync/push", { requestId: "request_00000001", records: [record] }, cookie, auth.csrfToken);
    expect(first.status).toBe(200);
    const firstBody = await json(first);
    const replay = await request("/api/sync/push", { requestId: "request_00000001", records: [record] }, cookie, auth.csrfToken);
    expect(await json(replay)).toEqual(firstBody);
    const conflict = await request("/api/sync/push", { requestId: "request_00000002", records: [{ ...record, value: { status: "partial" }, knownServerVersion: 0 }] }, cookie, auth.csrfToken);
    expect(conflict.status).toBe(409);
    const deleted = await request("/api/sync/push", { requestId: "request_00000003", records: [{ ...record, value: null, knownServerVersion: firstBody.accepted[0].version, deleted: true, clientUpdatedAt: 20 }] }, cookie, auth.csrfToken);
    expect(deleted.status).toBe(200);
    const pull = await request("/api/sync/pull?cursor=0", undefined, cookie);
    const pulled = await json(pull);
    expect(pulled.records).toHaveLength(1);
    expect(pulled.records[0]).toMatchObject({ recordKey: record.recordKey, version: 2, deleted: true });
    expect(pulled.cursor).toBeGreaterThan(0);
    const next = await request(`/api/sync/pull?cursor=${pulled.cursor}`, undefined, cookie);
    expect(await json(next)).toMatchObject({ cursor: pulled.cursor, records: [] });
  });

  test("push rolls back the whole batch when a later write loses its CAS", async () => {
    const login = await request("/api/auth/login", { email: "user@niypher.com", password: "another correct horse battery staple", remember: false });
    const auth = await json(login);
    const cookie = login.headers.get("Set-Cookie")!.split(";", 1)[0];
    const base = { namespace: "settings", recordKey: "cas-batch", clientUpdatedAt: 30, deviceId: "device-a", knownServerVersion: 0, deleted: false };
    const response = await request("/api/sync/push", {
      requestId: "request_cas_batch_01",
      records: [{ ...base, value: { theme: "light" } }, { ...base, value: { theme: "dark" }, clientUpdatedAt: 31 }],
    }, cookie, auth.csrfToken);
    expect(response.status).toBe(409);
    const stored = await env.DB.prepare("SELECT version FROM sync_records WHERE user_id=? AND namespace=? AND record_key=?")
      .bind(auth.user.id, "settings", "cas-batch").first();
    expect(stored).toBeNull();
  });

  test("concurrent replay of one request id is idempotent", async () => {
    const login = await request("/api/auth/login", { email: "user@niypher.com", password: "another correct horse battery staple", remember: false });
    const auth = await json(login);
    const cookie = login.headers.get("Set-Cookie")!.split(";", 1)[0];
    const body = {
      requestId: "request_concurrent_01",
      records: [{ namespace: "ui", recordKey: "panel", value: { open: true }, clientUpdatedAt: 40, deviceId: "device-a", knownServerVersion: 0, deleted: false }],
    };
    const [first, second] = await Promise.all([
      request("/api/sync/push", body, cookie, auth.csrfToken),
      request("/api/sync/push", body, cookie, auth.csrfToken),
    ]);
    expect([first.status, second.status]).toEqual([200, 200]);
    expect(await json(second)).toEqual(await json(first));
    const count = await env.DB.prepare("SELECT COUNT(*) count FROM sync_changes WHERE user_id=? AND namespace='ui' AND record_key='panel'")
      .bind(auth.user.id).first<{ count: number }>();
    expect(count?.count).toBe(1);
  });

  test("pull deduplicates only inside the 500-change window and advances to its boundary", async () => {
    const login = await request("/api/auth/login", { email: "user@niypher.com", password: "another correct horse battery staple", remember: false });
    const auth = await json(login);
    const cookie = login.headers.get("Set-Cookie")!.split(";", 1)[0];
    const before = await env.DB.prepare("SELECT COALESCE(MAX(seq),0) seq FROM sync_changes WHERE user_id=?").bind(auth.user.id).first<{ seq: number }>();
    const now = Date.now();
    await env.DB.prepare("INSERT INTO sync_records (user_id,namespace,record_key,value_json,updated_at,client_updated_at,device_id,version,deleted) VALUES (?,?,?,?,?,?,?,?,?)")
      .bind(auth.user.id, "reminder", "window-key", JSON.stringify({ enabled: true }), now, now, "device-window", 1, 0).run();
    const statements = Array.from({ length: 501 }, (_, index) => env.DB.prepare("INSERT INTO sync_changes (user_id,namespace,record_key,version,changed_at) VALUES (?,?,?,?,?)")
      .bind(auth.user.id, "reminder", "window-key", index + 1, now + index));
    await env.DB.batch(statements);
    const response = await request(`/api/sync/pull?cursor=${before?.seq ?? 0}`, undefined, cookie);
    const body = await json(response);
    expect(body.records).toHaveLength(1);
    expect(body.cursor).toBe((before?.seq ?? 0) + 500);
    const next = await json(await request(`/api/sync/pull?cursor=${body.cursor}`, undefined, cookie));
    expect(next.records).toHaveLength(1);
    expect(next.cursor).toBe((before?.seq ?? 0) + 501);
  });

  test("administrator can disable, enable, revoke and issue one-time temporary password", async () => {
    const login = await request("/api/auth/login", { email: "admin@niypher.com", password: "correct horse battery staple", remember: false });
    const auth = await json(login);
    const cookie = login.headers.get("Set-Cookie")!.split(";", 1)[0];
    const lookup = await request("/api/admin/users?email=user%40niypher.com", undefined, cookie);
    expect(lookup.status).toBe(200);
    const user = (await json(lookup)).user;
    expect((await request(`/api/admin/users/${user.id}/disable`, {}, cookie, auth.csrfToken)).status).toBe(200);
    expect((await request(`/api/admin/users/${user.id}/enable`, {}, cookie, auth.csrfToken)).status).toBe(200);
    const temporary = await request(`/api/admin/users/${user.id}/temporary-password`, {}, cookie, auth.csrfToken);
    const temporaryBody = await json(temporary);
    expect(temporaryBody.temporaryPassword).toMatch(/^[A-Za-z0-9_-]{20,}$/);
    const stored = await env.DB.prepare("SELECT password_params FROM users WHERE id=?").bind(user.id).first<{ password_params: string }>();
    expect(JSON.parse(stored!.password_params).iterations).toBe(1000);
    const tempLogin = await request("/api/auth/login", { email: "user@niypher.com", password: temporaryBody.temporaryPassword, remember: false });
    expect((await json(tempLogin)).user.mustChangePassword).toBe(true);
    const audit = await request("/api/admin/audit", undefined, cookie);
    const auditText = JSON.stringify(await json(audit));
    expect(auditText).not.toContain(temporaryBody.temporaryPassword);
  });

  test("authentication endpoints enforce the configured rate limit", async () => {
    let response = new Response();
    for (let index = 0; index < 25; index += 1) {
      response = await request("/api/auth/login", { email: `missing${index}@niypher.com`, password: "another correct horse battery staple", remember: false });
      if (response.status === 429) break;
    }
    expect(response.status).toBe(429);
    expect((await json(response)).error.code).toBe("RATE_LIMITED");
  });
});
