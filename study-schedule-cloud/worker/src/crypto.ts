export type PasswordDigest = { algorithm: "PBKDF2-SHA-256"; iterations: number; salt: string; digest: string };

export type Pbkdf2Env = { PBKDF2_ITERATIONS: string };

export function pbkdf2Iterations(env: Pbkdf2Env): number {
  const iterations = Number(env.PBKDF2_ITERATIONS);
  if (!Number.isSafeInteger(iterations) || iterations < 1) throw new Error("PBKDF2_ITERATIONS_INVALID");
  return iterations;
}

function bytesToBase64(value: Uint8Array): string {
  let binary = "";
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function randomToken(bytes = 32): string {
  return bytesToBase64(crypto.getRandomValues(new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function sha256(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return bytesToBase64(new Uint8Array(digest));
}

export function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  return difference === 0;
}

export async function constantTimeTextEqual(left: string, right: string): Promise<boolean> {
  const [a, b] = await Promise.all([crypto.subtle.digest("SHA-256", new TextEncoder().encode(left)), crypto.subtle.digest("SHA-256", new TextEncoder().encode(right))]);
  return constantTimeEqual(new Uint8Array(a), new Uint8Array(b));
}

export async function hashPassword(password: string, iterations: number): Promise<PasswordDigest> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const digest = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return { algorithm: "PBKDF2-SHA-256", iterations, salt: bytesToBase64(salt), digest: bytesToBase64(new Uint8Array(digest)) };
}

export async function verifyPassword(password: string, stored: PasswordDigest): Promise<boolean> {
  const salt = base64ToBytes(stored.salt);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const digest = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: stored.iterations }, key, 256);
  return constantTimeEqual(new Uint8Array(digest), base64ToBytes(stored.digest));
}
