CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT REFERENCES users(id),
  target_user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  result TEXT NOT NULL,
  source_hint TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX users_email_status_idx ON users(email_normalized, status);
CREATE INDEX audit_logs_created_idx ON audit_logs(created_at DESC);
CREATE INDEX audit_logs_actor_idx ON audit_logs(actor_user_id, created_at DESC);
