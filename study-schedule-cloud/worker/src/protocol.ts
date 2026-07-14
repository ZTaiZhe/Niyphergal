import { randomToken } from "./crypto";

export type ConflictRecord = { version: number; deleted: boolean; clientUpdatedAt: number; deviceId: string; value: unknown };

export function sessionCookie(token: string, maxAge: number): string {
  return `__Host-niypher_session=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Strict`;
}

export function clearSessionCookie(): string {
  return "__Host-niypher_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict";
}

function isCompleted(record: ConflictRecord): boolean {
  return !record.deleted && Boolean(record.value && typeof record.value === "object" && (record.value as { status?: unknown }).status === "done");
}

export function mergeConflict(left: ConflictRecord, right: ConflictRecord): ConflictRecord {
  if (left.version !== right.version) return left.version > right.version ? left : right;
  if (left.deleted !== right.deleted) return left.deleted ? left : right;
  if (isCompleted(left) !== isCompleted(right)) return isCompleted(left) ? left : right;
  if (left.clientUpdatedAt !== right.clientUpdatedAt) return left.clientUpdatedAt > right.clientUpdatedAt ? left : right;
  const leftKey = `${left.deviceId}:${JSON.stringify(left.value)}`;
  const rightKey = `${right.deviceId}:${JSON.stringify(right.value)}`;
  return leftKey >= rightKey ? left : right;
}

export function temporaryPassword(): string {
  return randomToken(24);
}
