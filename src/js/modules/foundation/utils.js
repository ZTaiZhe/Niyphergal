/**
 *
 *
 */

import { CONFIG } from './config.js';

/**
 *
 * @param {Function} func -
 * @param {number} delay -
 * @returns {Function}
 */
export function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

/**
 *
 * @param {Function} func -
 * @param {number} limit -
 * @returns {Function}
 */
export function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(null, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * ID
 * @returns {string} ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * HTMLXSS
 * @param {string} str -
 * @returns {string}
 */
export function escapeHtml(str) {
    if (str === null || str === undefined) {return '';}
    const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return String(str).replace(/[&<>"'`=/]/g, char => escapeMap[char]);
}

/**
 *
 * @param {Object} obj -
 * @returns {Object}
 */
export function escapeObject(obj) {
    if (obj === null || obj === undefined) {return obj;}
    if (typeof obj === 'string') {return escapeHtml(obj);}
    if (typeof obj !== 'object') {return obj;}
    if (Array.isArray(obj)) {return obj.map(escapeObject);}

    const escaped = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            escaped[key] = escapeObject(obj[key]);
        }
    }
    return escaped;
}

/**
 *
 * @param {string} email -
 * @returns {boolean}
 */
export function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 *
 * @param {string} email -
 * @returns {boolean}
 */
export function validateEmailDomain(email) {
    const domain = email.split('@')[1];
    const domainParts = domain.split('.');

    let mainDomain;
    if (domainParts.length >= 2) {
        mainDomain = domainParts.slice(-2).join('.');
    } else {
        mainDomain = domain;
    }

    return CONFIG.EMAIL.SUPPORTED_DOMAINS.includes(mainDomain);
}

/**
 *
 * @param {string} password -
 * @returns {Object}
 */
export function checkPasswordValidity(password) {
    const checks = {
        length: password.length >= CONFIG.SECURITY.PASSWORD_MIN_LENGTH,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const allValid = checks.length && checks.upper && checks.lower && checks.number && checks.special;
    return { checks, allValid };
}

/**
 *
 * @param {string} message -
 * @param {string} type - success, error, info, warning
 * @param {number} duration -
 */
export function showNotification(message, type = 'info', duration = CONFIG.UI.TOAST_DURATION) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, duration);
}
export function showLoader() {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = '<div class="loading-spinner"></div>';
    loader.id = 'app-loader';

    document.body.appendChild(loader);
}
export function hideLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
        loader.remove();
    }
}

/**
 *
 * @param {string} text -
 * @returns {string}
 */
import PinyinProLocal from '../../lib/pinyin-pro.js';

function getPinyinInstance() {
    if (window.pinyinPro) {
        return window.pinyinPro;
    }
    return PinyinProLocal.constructor ? PinyinProLocal : PinyinProLocal;
}

export function chineseToPinyin(text) {
    if (!text || typeof text !== 'string') {return '';}
    try {
        const instance = getPinyinInstance();
        const result = instance.pinyin(text, {
            pattern: 'pinyin',
            toneType: 'none',
            type: 'string'
        });
        return (result || '').toLowerCase();
    } catch (e) {
        return text.toLowerCase();
    }
}

export function chineseToPinyinArray(text) {
    if (!text || typeof text !== 'string') {return [];}
    try {
        const instance = getPinyinInstance();
        const result = instance.pinyin(text, {
            pattern: 'pinyin',
            toneType: 'none',
            type: 'array',
            multiple: true
        });
        return result || [];
    } catch (e) {
        return text.split('').map(char => [char.toLowerCase()]);
    }
}

/**
 *
 * @param {Object} game -
 * @returns {string}
 */
export function generatePinyinCode(game) {
    let code = '';

    if (game.title) {
        code += chineseToPinyin(game.title) + ' ';
    }

    if (game.tags && game.tags.length > 0) {
        game.tags.forEach(tag => {
            code += chineseToPinyin(tag) + ' ';
        });
    }

    return code.trim().toLowerCase();
}

export async function generateSalt(length = 16) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

const PASSWORD_HASH_ITERATIONS = 600000;

export async function hashPassword(password, salt) {
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const hashBuffer = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: encoder.encode(salt),
            iterations: PASSWORD_HASH_ITERATIONS,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password, salt, storedHash) {
    const computedHash = await hashPassword(password, salt);
    return computedHash === storedHash;
}

export function getFirstLetters(text) {
    if (!text || typeof text !== 'string') {return '';}
    try {
        const instance = getPinyinInstance();
        const result = instance.pinyin(text, {
            pattern: 'first',
            toneType: 'none',
            type: 'string'
        });
        return (result || '').toLowerCase();
    } catch (e) {
        let result = '';
        for (const char of text) {
            if (/[a-zA-Z]/.test(char)) {
                result += char.toLowerCase();
            }
        }
        return result;
    }
}

export function getFirstLettersArray(text) {
    if (!text || typeof text !== 'string') {return [];}
    try {
        const instance = getPinyinInstance();
        const result = instance.pinyin(text, {
            pattern: 'first',
            toneType: 'none',
            type: 'array',
            multiple: true
        });
        return result || [];
    } catch (e) {
        return text.split('').map(char => [char.toLowerCase()]);
    }
}

export function fuzzyMatch(text, pattern) {
    if (!text || !pattern) {return false;}

    let textIndex = 0;
    let patternIndex = 0;

    while (textIndex < text.length && patternIndex < pattern.length) {
        if (text[textIndex].toLowerCase() === pattern[patternIndex].toLowerCase()) {
            patternIndex++;
        }
        textIndex++;
    }

    return patternIndex === pattern.length;
}
