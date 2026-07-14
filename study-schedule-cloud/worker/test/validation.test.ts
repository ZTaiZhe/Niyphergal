import { describe, expect, test } from "vitest";
import { normalizeEmail, validatePassword, validateSyncRecord } from "../src/validation";

describe("validation", () => {
  test("normalizes and accepts only exact niypher.com addresses", () => {
    expect(normalizeEmail("  User@NIYPHER.com ")).toBe("user@niypher.com");
    expect(() => normalizeEmail("user@sub.niypher.com")).toThrow("EMAIL_INVALID");
    expect(() => normalizeEmail("user@niypher.com.example")).toThrow("EMAIL_INVALID");
  });

  test("enforces password length bounds", () => {
    expect(validatePassword("correct horse battery staple")).toBe(true);
    expect(() => validatePassword("short")).toThrow("PASSWORD_INVALID");
    expect(() => validatePassword("x".repeat(257))).toThrow("PASSWORD_INVALID");
  });

  test("accepts bounded records and rejects invalid namespaces and oversized values", () => {
    expect(validateSyncRecord({ namespace: "course", recordKey: "1:U1:0-20", value: { status: "done" }, clientUpdatedAt: 10, deviceId: "d1", knownServerVersion: 0, deleted: false })).toMatchObject({ namespace: "course" });
    expect(() => validateSyncRecord({ namespace: "secret", recordKey: "x", value: {}, clientUpdatedAt: 1, deviceId: "d", knownServerVersion: 0, deleted: false })).toThrow("SYNC_RECORD_INVALID");
    expect(() => validateSyncRecord({ namespace: "ui", recordKey: "x", value: { text: "x".repeat(70000) }, clientUpdatedAt: 1, deviceId: "d", knownServerVersion: 0, deleted: false })).toThrow("SYNC_RECORD_INVALID");
  });
});
