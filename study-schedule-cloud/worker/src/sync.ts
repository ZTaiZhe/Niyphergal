import { audit } from "./audit";
import { error, json } from "./response";
import type { ActiveSession } from "./sessions";
import { validateRequestId, validateSyncRecord, type SyncInput } from "./validation";

export async function pull(request: Request, db: D1Database, session: ActiveSession): Promise<Response> {
  if (session.user.mustChangePassword) return error("PASSWORD_CHANGE_REQUIRED", "必须先修改密码", 403);
  const cursor = Number(new URL(request.url).searchParams.get("cursor") ?? "0");
  if (!Number.isSafeInteger(cursor) || cursor < 0) return error("CURSOR_INVALID", "游标无效", 400);
  const changes = await db.prepare("WITH change_window AS (SELECT seq,namespace,record_key FROM sync_changes WHERE user_id=? AND seq>? ORDER BY seq LIMIT 500), latest_changes AS (SELECT namespace,record_key,MAX(seq) seq FROM change_window GROUP BY namespace,record_key) SELECT r.namespace,r.record_key recordKey,r.value_json valueJson,r.updated_at updatedAt,r.client_updated_at clientUpdatedAt,r.device_id deviceId,r.version,r.deleted,c.seq,(SELECT MAX(seq) FROM change_window) window_cursor FROM latest_changes c JOIN sync_records r ON r.user_id=? AND r.namespace=c.namespace AND r.record_key=c.record_key ORDER BY c.seq")
    .bind(session.user.id, cursor, session.user.id).all<Record<string, unknown>>();
  const records = changes.results.map((row) => ({ namespace: row.namespace, recordKey: row.recordKey, value: row.valueJson ? JSON.parse(String(row.valueJson)) : null, updatedAt: row.updatedAt, clientUpdatedAt: row.clientUpdatedAt, deviceId: row.deviceId, version: row.version, deleted: Boolean(row.deleted) }));
  const nextCursor = changes.results.length ? Number(changes.results[0].window_cursor) : cursor;
  return json({ ok: true, cursor: nextCursor, records });
}

export async function push(request: Request, db: D1Database, session: ActiveSession, body: unknown): Promise<Response> {
  if (session.user.mustChangePassword) return error("PASSWORD_CHANGE_REQUIRED", "必须先修改密码", 403);
  if (!body || typeof body !== "object") return error("SYNC_INVALID", "同步请求无效", 400);
  const value = body as { requestId?: unknown; records?: unknown };
  let requestId: string;
  let records: SyncInput[];
  try {
    requestId = validateRequestId(value.requestId);
    if (!Array.isArray(value.records) || value.records.length < 1 || value.records.length > 100) throw new Error();
    records = value.records.map(validateSyncRecord);
  } catch { return error("SYNC_INVALID", "同步请求无效", 400); }
  const replay = await db.prepare("SELECT response_json FROM sync_requests WHERE user_id=? AND request_id=?").bind(session.user.id, requestId).first<{ response_json: string }>();
  if (replay) return json(JSON.parse(replay.response_json));
  const accepted: Array<{ namespace: string; recordKey: string; version: number }> = [];
  const conflicts: unknown[] = [];
  for (const record of records) {
    const current = await db.prepare("SELECT value_json,client_updated_at,device_id,version,deleted,updated_at FROM sync_records WHERE user_id=? AND namespace=? AND record_key=?")
      .bind(session.user.id, record.namespace, record.recordKey).first<Record<string, unknown>>();
    const currentVersion = current ? Number(current.version) : 0;
    if (record.knownServerVersion !== currentVersion) {
      conflicts.push({ namespace: record.namespace, recordKey: record.recordKey, client: record, server: current ? { value: current.value_json ? JSON.parse(String(current.value_json)) : null, clientUpdatedAt: current.client_updated_at, deviceId: current.device_id, version: current.version, deleted: Boolean(current.deleted), updatedAt: current.updated_at } : null });
      continue;
    }
    accepted.push({ namespace: record.namespace, recordKey: record.recordKey, version: currentVersion + 1 });
  }
  if (conflicts.length) {
    for (const conflict of conflicts as Array<any>) await db.prepare("INSERT INTO sync_conflicts (id,user_id,namespace,record_key,client_version,server_version,resolution,created_at) VALUES (?,?,?,?,?,?,?,?)").bind(crypto.randomUUID(), session.user.id, conflict.namespace, conflict.recordKey, conflict.client.knownServerVersion, conflict.server?.version ?? 0, "returned-to-client", Date.now()).run();
    return json({ ok: false, error: { code: "SYNC_CONFLICT", message: "同步记录存在冲突" }, conflicts }, 409);
  }
  const now = Date.now();
  const statements: D1PreparedStatement[] = [];
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    const version = accepted[index].version;
    statements.push(db.prepare("INSERT INTO sync_records (user_id,namespace,record_key,value_json,updated_at,client_updated_at,device_id,version,deleted) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,namespace,record_key) DO UPDATE SET value_json=excluded.value_json,updated_at=excluded.updated_at,client_updated_at=excluded.client_updated_at,device_id=excluded.device_id,version=excluded.version,deleted=excluded.deleted")
      .bind(session.user.id, record.namespace, record.recordKey, record.deleted ? null : JSON.stringify(record.value), now, record.clientUpdatedAt, record.deviceId, version, record.deleted ? 1 : 0));
    statements.push(db.prepare("INSERT INTO sync_changes (user_id,namespace,record_key,version,changed_at) VALUES (?,?,?,?,?)").bind(session.user.id, record.namespace, record.recordKey, version, now));
  }
  const response = { ok: true, accepted };
  statements.push(db.prepare("INSERT INTO sync_requests (user_id,request_id,response_json,created_at) VALUES (?,?,?,?)").bind(session.user.id, requestId, JSON.stringify(response), now));
  try {
    await db.batch(statements);
  } catch {
    const committedReplay = await db.prepare("SELECT response_json FROM sync_requests WHERE user_id=? AND request_id=?").bind(session.user.id, requestId).first<{ response_json: string }>();
    if (committedReplay) return json(JSON.parse(committedReplay.response_json));
    const racedConflicts = await collectConflicts(db, session.user.id, records);
    return json({ ok: false, error: { code: "SYNC_CONFLICT", message: "同步记录存在冲突" }, conflicts: racedConflicts }, 409);
  }
  await audit(db, session.user.id, session.user.id, "sync-push", `accepted:${accepted.length}`, request);
  return json(response);
}

async function collectConflicts(db: D1Database, userId: string, records: SyncInput[]): Promise<unknown[]> {
  const conflicts: unknown[] = [];
  for (const record of records) {
    const current = await db.prepare("SELECT value_json,client_updated_at,device_id,version,deleted,updated_at FROM sync_records WHERE user_id=? AND namespace=? AND record_key=?")
      .bind(userId, record.namespace, record.recordKey).first<Record<string, unknown>>();
    const currentVersion = current ? Number(current.version) : 0;
    if (record.knownServerVersion !== currentVersion) {
      conflicts.push({ namespace: record.namespace, recordKey: record.recordKey, client: record, server: current ? { value: current.value_json ? JSON.parse(String(current.value_json)) : null, clientUpdatedAt: current.client_updated_at, deviceId: current.device_id, version: current.version, deleted: Boolean(current.deleted), updatedAt: current.updated_at } : null });
    }
  }
  return conflicts;
}
