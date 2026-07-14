export const SYNC_NAMESPACES = ["course", "evening", "settings", "reminder", "ui"] as const;
export type SyncNamespace = (typeof SYNC_NAMESPACES)[number];

export type SyncInput = {
  namespace: SyncNamespace;
  recordKey: string;
  value: unknown;
  clientUpdatedAt: number;
  deviceId: string;
  knownServerVersion: number;
  deleted: boolean;
};

export function normalizeEmail(input: unknown): string {
  if (typeof input !== "string") throw new Error("EMAIL_INVALID");
  const value = input.trim().toLowerCase();
  if (value.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@niypher\.com$/.test(value)) {
    throw new Error("EMAIL_INVALID");
  }
  return value;
}

export function validatePassword(input: unknown): true {
  if (typeof input !== "string" || input.length < 12 || input.length > 256) {
    throw new Error("PASSWORD_INVALID");
  }
  return true;
}

export function validateSyncRecord(input: unknown): SyncInput {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("SYNC_RECORD_INVALID");
  const value = input as Record<string, unknown>;
  const namespace = value.namespace;
  const recordKey = value.recordKey;
  const deviceId = value.deviceId;
  const serialized = JSON.stringify(value.value ?? null);
  if (!SYNC_NAMESPACES.includes(namespace as SyncNamespace) || typeof recordKey !== "string" || recordKey.length < 1 || recordKey.length > 300 || typeof deviceId !== "string" || deviceId.length < 1 || deviceId.length > 100 || typeof value.clientUpdatedAt !== "number" || !Number.isSafeInteger(value.clientUpdatedAt) || value.clientUpdatedAt < 0 || typeof value.knownServerVersion !== "number" || !Number.isSafeInteger(value.knownServerVersion) || value.knownServerVersion < 0 || typeof value.deleted !== "boolean" || serialized.length > 65536) {
    throw new Error("SYNC_RECORD_INVALID");
  }
  return value as SyncInput;
}

export function validateRequestId(input: unknown): string {
  if (typeof input !== "string" || !/^[A-Za-z0-9_-]{16,100}$/.test(input)) throw new Error("REQUEST_ID_INVALID");
  return input;
}
