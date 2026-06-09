import { describe, it, expect, vi } from 'vitest';

const ENCRYPTION_PREFIX = 'ENCv2:';
const ENCRYPTION_PREFIX_V1 = 'ENCv1:';

describe('Crypto Module', () => {
    describe('isEncrypted', () => {
        const isEncrypted = (data) => {
            return data && typeof data === 'string' && (
                data.startsWith(ENCRYPTION_PREFIX) || data.startsWith(ENCRYPTION_PREFIX_V1)
            );
        };

        it('should identify ENCv2 encrypted data', () => {
            expect(isEncrypted('ENCv2:somebase64data')).toBe(true);
        });

        it('should identify ENCv1 encrypted data', () => {
            expect(isEncrypted('ENCv1:somebase64data')).toBe(true);
        });

        it('should not identify plain text as encrypted', () => {
            expect(isEncrypted('plain text')).toBe(false);
        });

        it('should not identify JSON as encrypted', () => {
            expect(isEncrypted('{"key":"value"}')).toBe(false);
        });

        it('should handle null/undefined', () => {
            expect(isEncrypted(null)).toBe(false);
            expect(isEncrypted(undefined)).toBe(false);
        });

        it('should handle empty string', () => {
            expect(isEncrypted('')).toBe(false);
        });
    });

    describe('Encryption/Decryption Roundtrip', () => {
        it('should encrypt and decrypt data with Web Crypto API', async () => {
            const encoder = new TextEncoder();

            const deriveKey = async (password) => {
                const keyMaterial = await crypto.subtle.importKey(
                    'raw',
                    encoder.encode(password),
                    'PBKDF2',
                    false,
                    ['deriveBits', 'deriveKey']
                );
                return crypto.subtle.deriveKey(
                    {
                        name: 'PBKDF2',
                        salt: encoder.encode('test-salt'),
                        iterations: 1000,
                        hash: 'SHA-256'
                    },
                    keyMaterial,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['encrypt', 'decrypt']
                );
            };

            const encrypt = async (data, key) => {
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const plaintext = encoder.encode(JSON.stringify(data));
                const ciphertext = await crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    plaintext
                );
                const combined = new Uint8Array(iv.length + ciphertext.byteLength);
                combined.set(iv, 0);
                combined.set(new Uint8Array(ciphertext), iv.length);
                return btoa(String.fromCharCode(...combined));
            };

            const decrypt = async (base64, key) => {
                const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
                const iv = combined.slice(0, 12);
                const ciphertext = combined.slice(12);
                const plaintext = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    ciphertext
                );
                return JSON.parse(new TextDecoder().decode(plaintext));
            };

            const key = await deriveKey('test-password');
            const testData = { name: 'test', email: 'test@example.com' };

            const encrypted = await encrypt(testData, key);
            expect(encrypted).toBeTruthy();
            expect(typeof encrypted).toBe('string');

            const decrypted = await decrypt(encrypted, key);
            expect(decrypted).toEqual(testData);
        });

        it('should fail decryption with wrong key', async () => {
            const encoder = new TextEncoder();

            const deriveKey = async (password, iterations = 1000) => {
                const keyMaterial = await crypto.subtle.importKey(
                    'raw',
                    encoder.encode(password),
                    'PBKDF2',
                    false,
                    ['deriveBits', 'deriveKey']
                );
                return crypto.subtle.deriveKey(
                    {
                        name: 'PBKDF2',
                        salt: encoder.encode('test-salt'),
                        iterations,
                        hash: 'SHA-256'
                    },
                    keyMaterial,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['encrypt', 'decrypt']
                );
            };

            const encrypt = async (data, key) => {
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const plaintext = encoder.encode(JSON.stringify(data));
                const ciphertext = await crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv },
                    key,
                    plaintext
                );
                const combined = new Uint8Array(iv.length + ciphertext.byteLength);
                combined.set(iv, 0);
                combined.set(new Uint8Array(ciphertext), iv.length);
                return btoa(String.fromCharCode(...combined));
            };

            const correctKey = await deriveKey('correct-password');
            const wrongKey = await deriveKey('wrong-password');

            const testData = { secret: 'data' };
            const encrypted = await encrypt(testData, correctKey);

            await expect((async () => {
                const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
                const iv = combined.slice(0, 12);
                const ciphertext = combined.slice(12);
                await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv },
                    wrongKey,
                    ciphertext
                );
            })()).rejects.toThrow();
        });
    });
});
