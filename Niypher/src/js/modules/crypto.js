/**
 *
 *  Web Crypto API  AES-256-GCM
 *
 */

import { CONFIG } from './config.js';

const ENCRYPTION_PREFIX = 'ENCv2:';
const ENCRYPTION_PREFIX_V1 = 'ENCv1:';
const KEY_DERIVATION_ITERATIONS = 600000;

let cachedKey = null;
let cachedPassword = null;
let sessionPassword = null;

async function deriveKeyFromPassword(password) {
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    const salt = encoder.encode(CONFIG.ENCRYPTION.KEY_SALT);

    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: KEY_DERIVATION_ITERATIONS,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );

    return key;
}

async function getKeyForPassword(password) {
    if (!cachedKey || cachedPassword !== password) {
        cachedKey = await deriveKeyFromPassword(password);
        cachedPassword = password;
    }
    return cachedKey;
}

export function setSessionPassword(password) {
    sessionPassword = password;
    cachedKey = null;
    cachedPassword = null;
}

export function hasSessionPassword() {
    return sessionPassword !== null;
}

export function clearSessionPassword() {
    sessionPassword = null;
    cachedKey = null;
    cachedPassword = null;
}

async function getCurrentKey() {
    if (!sessionPassword) {
        throw new Error('Session password not set. User must be logged in.');
    }
    return getKeyForPassword(sessionPassword);
}

export async function encryptData(data, password = null) {
    try {
        const encoder = new TextEncoder();
        const plaintext = encoder.encode(JSON.stringify(data));

        const iv = crypto.getRandomValues(new Uint8Array(12));

        const key = password
            ? await getKeyForPassword(password)
            : await getCurrentKey();

        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            plaintext
        );

        const combined = new Uint8Array(iv.length + ciphertext.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(ciphertext), iv.length);

        const base64 = btoa(String.fromCharCode(...combined));
        return ENCRYPTION_PREFIX + base64;
    } catch (error) {
        console.error('加密失败:', error);
        throw new Error('数据加密失败');
    }
}

export async function decryptData(encryptedData, password = null) {
    try {
        if (!encryptedData) {
            throw new Error('No data provided');
        }

        if (encryptedData.startsWith(ENCRYPTION_PREFIX)) {
            const key = password
                ? await getKeyForPassword(password)
                : await getCurrentKey();

            const base64 = encryptedData.slice(ENCRYPTION_PREFIX.length);
            const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

            const iv = combined.slice(0, 12);
            const ciphertext = combined.slice(12);

            const plaintext = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                ciphertext
            );

            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(plaintext));
        } else if (encryptedData.startsWith(ENCRYPTION_PREFIX_V1)) {
            return await decryptV1Data(encryptedData, password);
        }
        return JSON.parse(encryptedData);

    } catch (error) {
        console.error('解密失败:', error);
        try {
            return JSON.parse(encryptedData);
        } catch (parseError) {
            throw new Error('数据解密失败');
        }
    }
}

async function decryptV1Data(encryptedData, password) {
    const encoder = new TextEncoder();

    const components = [
        screen.width || 0,
        screen.height || 0,
        screen.colorDepth || 24,
        new Date().getTimezoneOffset(),
        navigator.language || 'en-US',
        navigator.platform || 'unknown',
        navigator.hardwareConcurrency || 4,
        navigator.deviceMemory || 8
    ];
    const fingerprint = components.join('|');

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(fingerprint + CONFIG.ENCRYPTION.KEY_SALT),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    const oldKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode(CONFIG.ENCRYPTION.KEY_SALT),
            iterations: CONFIG.ENCRYPTION.ITERATIONS || 10000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );

    const base64 = encryptedData.slice(ENCRYPTION_PREFIX_V1.length);
    const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        oldKey,
        ciphertext
    );

    const decoder = new TextDecoder();
    const decryptedData = JSON.parse(decoder.decode(plaintext));

    if (password) {
        try {
            await secureSetItem(
                encryptedData.startsWith(localStorage.getItem('niypher_user'))
                    ? 'niypher_user'
                    : 'niypher_registered_users',
                decryptedData
            );
        } catch (e) {
            console.warn('V1数据迁移加密失败:', e);
        }
    }

    return decryptedData;
}

export function isEncrypted(data) {
    return typeof data === 'string' && (
        data.startsWith(ENCRYPTION_PREFIX) || data.startsWith(ENCRYPTION_PREFIX_V1)
    );
}

export async function secureSetItem(key, value) {
    if (!sessionPassword) {
        throw new Error('Cannot secure store without session password');
    }
    const encrypted = await encryptData(value, sessionPassword);
    localStorage.setItem(key, encrypted);
}

export async function secureGetItem(key) {
    const data = localStorage.getItem(key);
    if (!data) {return null;}

    try {
        return await decryptData(data, sessionPassword);
    } catch (error) {
        if (data.startsWith(ENCRYPTION_PREFIX_V1) && sessionPassword) {
            try {
                return await decryptV1Data(data, sessionPassword);
            } catch (e) {
                console.warn(`安全读取 ${key} 失败:`, e);
                return null;
            }
        }
        console.warn(`安全读取 ${key} 失败:`, error);
        return null;
    }
}

export function secureRemoveItem(key) {
    localStorage.removeItem(key);
}

export function clearKeyCache() {
    cachedKey = null;
    cachedPassword = null;
}

export default {
    encryptData,
    decryptData,
    isEncrypted,
    secureSetItem,
    secureGetItem,
    secureRemoveItem,
    clearKeyCache,
    setSessionPassword,
    hasSessionPassword,
    clearSessionPassword
};
