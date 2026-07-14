CREATE TABLE sync_records (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  namespace TEXT NOT NULL CHECK (namespace IN ('course', 'evening', 'settings', 'reminder', 'ui')),
  record_key TEXT NOT NULL,
  value_json TEXT,
  updated_at INTEGER NOT NULL,
  client_updated_at INTEGER NOT NULL,
  device_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0 CHECK (deleted IN (0, 1)),
  PRIMARY KEY (user_id, namespace, record_key)
);

CREATE TABLE sync_changes (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  namespace TEXT NOT NULL,
  record_key TEXT NOT NULL,
  version INTEGER NOT NULL,
  changed_at INTEGER NOT NULL
);

CREATE INDEX sync_changes_user_seq_idx ON sync_changes(user_id, seq);

CREATE TABLE sync_requests (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_id TEXT NOT NULL,
  response_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, request_id)
);

CREATE TABLE sync_conflicts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  namespace TEXT NOT NULL,
  record_key TEXT NOT NULL,
  client_version INTEGER NOT NULL,
  server_version INTEGER NOT NULL,
  resolution TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
