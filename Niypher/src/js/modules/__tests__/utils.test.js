import { describe, it, expect, vi, beforeEach } from 'vitest';

const escapeHtml = (str) => {
    if (!str) {return '';}
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const validateEmailFormat = (email) => {
    if (!email || typeof email !== 'string') {return false;}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const checkPasswordValidity = (password) => {
    if (!password || typeof password !== 'string') {
        return { allValid: false, checks: { length: false, upper: false, lower: false, number: false, special: false } };
    }
    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    return { allValid: Object.values(checks).every(Boolean), checks };
};

const debounce = (fn, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
};

const throttle = (fn, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

const fuzzyMatch = (text, pattern) => {
    if (!text || !pattern) {return false;}
    text = text.toLowerCase();
    pattern = pattern.toLowerCase();
    let textIndex = 0;
    let patternIndex = 0;
    while (textIndex < text.length && patternIndex < pattern.length) {
        if (text[textIndex] === pattern[patternIndex]) {
            patternIndex++;
        }
        textIndex++;
    }
    return patternIndex === pattern.length;
};

describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
        expect(escapeHtml('<script>alert("xss")</script>')).toBe(
            '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
        );
    });

    it('should escape ampersands', () => {
        expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('should escape single quotes', () => {
        expect(escapeHtml('it\'s')).toBe('it&#039;s');
    });

    it('should return empty string for null/undefined', () => {
        expect(escapeHtml(null)).toBe('');
        expect(escapeHtml(undefined)).toBe('');
    });

    it('should not modify safe strings', () => {
        expect(escapeHtml('hello world')).toBe('hello world');
    });
});

describe('validateEmailFormat', () => {
    it('should accept valid email addresses', () => {
        expect(validateEmailFormat('user@example.com')).toBe(true);
        expect(validateEmailFormat('test.user@domain.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
        expect(validateEmailFormat('invalid')).toBe(false);
        expect(validateEmailFormat('user@')).toBe(false);
        expect(validateEmailFormat('@domain.com')).toBe(false);
        expect(validateEmailFormat('user@domain')).toBe(false);
        expect(validateEmailFormat('')).toBe(false);
        expect(validateEmailFormat(null)).toBe(false);
    });

    it('should reject emails with spaces', () => {
        expect(validateEmailFormat('user @domain.com')).toBe(false);
    });
});

describe('checkPasswordValidity', () => {
    it('should accept strong passwords', () => {
        const result = checkPasswordValidity('Test@1234');
        expect(result.allValid).toBe(true);
        expect(result.checks.length).toBe(true);
        expect(result.checks.upper).toBe(true);
        expect(result.checks.lower).toBe(true);
        expect(result.checks.number).toBe(true);
        expect(result.checks.special).toBe(true);
    });

    it('should reject weak passwords', () => {
        expect(checkPasswordValidity('12345678').allValid).toBe(false);
        expect(checkPasswordValidity('abcdefgh').allValid).toBe(false);
        expect(checkPasswordValidity('Abcdefgh').allValid).toBe(false);
    });

    it('should reject short passwords', () => {
        expect(checkPasswordValidity('Te@1').allValid).toBe(false);
    });

    it('should handle null/undefined input', () => {
        expect(checkPasswordValidity(null).allValid).toBe(false);
        expect(checkPasswordValidity(undefined).allValid).toBe(false);
    });
});

describe('fuzzyMatch', () => {
    it('should match substrings in order', () => {
        expect(fuzzyMatch('hello world', 'hlo')).toBe(true);
        expect(fuzzyMatch('hello world', 'hw')).toBe(true);
    });

    it('should be case insensitive', () => {
        expect(fuzzyMatch('Hello World', 'hlo')).toBe(true);
        expect(fuzzyMatch('hello world', 'HLO')).toBe(true);
    });

    it('should not match out-of-order characters', () => {
        expect(fuzzyMatch('hello', 'olh')).toBe(false);
    });

    it('should handle empty inputs', () => {
        expect(fuzzyMatch('', 'test')).toBe(false);
        expect(fuzzyMatch('test', '')).toBe(false);
        expect(fuzzyMatch(null, 'test')).toBe(false);
    });

    it('should match exact strings', () => {
        expect(fuzzyMatch('hello', 'hello')).toBe(true);
    });
});

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('should delay function execution', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        debounced('test');
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledWith('test');
    });

    it('should only execute the last call', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        debounced('first');
        debounced('second');
        debounced('third');

        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith('third');
    });
});

describe('throttle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('should execute function immediately on first call', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100);

        throttled('test');
        expect(fn).toHaveBeenCalledWith('test');
    });

    it('should throttle subsequent calls within limit', () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100);

        throttled('first');
        throttled('second');
        throttled('third');

        expect(fn).toHaveBeenCalledTimes(1);
    });
});
