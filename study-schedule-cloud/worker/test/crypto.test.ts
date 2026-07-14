import { describe, expect, test } from "vitest";
import { constantTimeEqual, constantTimeTextEqual, hashPassword, verifyPassword } from "../src/crypto";

describe("crypto", () => {
  test("hashes passwords with independent salts and verifies them", async () => {
    const first = await hashPassword("correct horse battery staple", 1000);
    const second = await hashPassword("correct horse battery staple", 1000);
    expect(first.salt).not.toBe(second.salt);
    expect(first.digest).not.toBe(second.digest);
    expect(await verifyPassword("correct horse battery staple", first)).toBe(true);
    expect(await verifyPassword("wrong password value", first)).toBe(false);
  });

  test("constant-time comparison rejects unequal lengths and bytes", () => {
    expect(constantTimeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2]))).toBe(true);
    expect(constantTimeEqual(new Uint8Array([1]), new Uint8Array([1, 2]))).toBe(false);
    expect(constantTimeEqual(new Uint8Array([1, 3]), new Uint8Array([1, 2]))).toBe(false);
  });

  test("compares encoded digests without direct string equality", async () => {
    expect(await constantTimeTextEqual("digest-value", "digest-value")).toBe(true);
    expect(await constantTimeTextEqual("digest-value", "digest-other")).toBe(false);
  });
});
