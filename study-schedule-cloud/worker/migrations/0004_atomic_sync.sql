CREATE TRIGGER sync_records_insert_version_guard
BEFORE INSERT ON sync_records
WHEN NEW.version <> 1 AND NOT EXISTS (
  SELECT 1 FROM sync_records
  WHERE user_id = NEW.user_id
    AND namespace = NEW.namespace
    AND record_key = NEW.record_key
)
BEGIN
  SELECT RAISE(ABORT, 'SYNC_CAS_CONFLICT');
END;

CREATE TRIGGER sync_records_update_version_guard
BEFORE UPDATE OF version ON sync_records
WHEN NEW.version <> OLD.version + 1
BEGIN
  SELECT RAISE(ABORT, 'SYNC_CAS_CONFLICT');
END;
