import { describe, expect, test } from "vitest";
import { mergeConflict, sessionCookie, temporaryPassword } from "../src/protocol";

describe("protocol rules", () => {
  test("emits a host-only strict secure HttpOnly session cookie", () => {
    const cookie = sessionCookie("raw-token", 3600);
    expect(cookie).toContain("__Host-niypher_session=raw-token");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Strict");
    expect(cookie).toContain("Path=/");
    expect(cookie).not.toContain("Domain=");
  });

  test("newer tombstones beat stale updates and completed course progress is monotonic", () => {
    const tombstone = { version: 3, deleted: true, clientUpdatedAt: 30, deviceId: "b", value: null };
    const stale = { version: 2, deleted: false, clientUpdatedAt: 40, deviceId: "a", value: { status: "done" } };
    expect(mergeConflict(tombstone, stale)).toEqual(tombstone);
    const done = { version: 4, deleted: false, clientUpdatedAt: 20, deviceId: "a", value: { status: "done" } };
    const oldPartial = { version: 3, deleted: false, clientUpdatedAt: 30, deviceId: "b", value: { status: "partial" } };
    expect(mergeConflict(done, oldPartial)).toEqual(done);
  });

  test("stable tie breaking gives both devices the same result", () => {
    const a = { version: 2, deleted: false, clientUpdatedAt: 20, deviceId: "a", value: { theme: "light" } };
    const b = { version: 2, deleted: false, clientUpdatedAt: 20, deviceId: "b", value: { theme: "dark" } };
    expect(mergeConflict(a, b)).toEqual(mergeConflict(b, a));
  });

  test("temporary passwords are high entropy and URL-safe", () => {
    const value = temporaryPassword();
    expect(value.length).toBeGreaterThanOrEqual(20);
    expect(value).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});
