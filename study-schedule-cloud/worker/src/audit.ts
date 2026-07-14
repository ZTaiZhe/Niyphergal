export async function audit(db: D1Database, actorUserId: string | null, targetUserId: string | null, action: string, result: string, request: Request): Promise<void> {
  const sourceHint = request.headers.get("CF-Connecting-IP") ? "cloudflare" : "local";
  await db.prepare("INSERT INTO audit_logs (id,actor_user_id,target_user_id,action,result,source_hint,created_at) VALUES (?,?,?,?,?,?,?)")
    .bind(crypto.randomUUID(), actorUserId, targetUserId, action, result, sourceHint, Date.now()).run();
}
