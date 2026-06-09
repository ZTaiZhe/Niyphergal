import { describe, it, expect } from 'vitest';

class LRUCache {
    constructor(maxSize = 50, defaultTTL = 5 * 60 * 1000) {
        this.maxSize = maxSize;
        this.defaultTTL = defaultTTL;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) {return null;}
        const entry = this.cache.get(key);
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }
        this.cache.delete(key);
        this.cache.set(key, entry);
        return entry.value;
    }

    set(key, value, ttl = this.defaultTTL) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        this.cache.set(key, { value, expiry: Date.now() + ttl });
        if (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }

    has(key) {
        if (!this.cache.has(key)) {return false;}
        const entry = this.cache.get(key);
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }

    delete(key) {
        return this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    get size() {
        return this.cache.size;
    }
}

describe('LRUCache', () => {
    it('should store and retrieve values', () => {
        const cache = new LRUCache(10);
        cache.set('key1', 'value1');
        expect(cache.get('key1')).toBe('value1');
    });

    it('should return null for non-existent keys', () => {
        const cache = new LRUCache(10);
        expect(cache.get('nonexistent')).toBe(null);
    });

    it('should evict oldest entry when max size reached', () => {
        const cache = new LRUCache(3);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.set('c', 3);
        cache.set('d', 4);

        expect(cache.get('a')).toBe(null);
        expect(cache.get('b')).toBe(2);
        expect(cache.get('c')).toBe(3);
        expect(cache.get('d')).toBe(4);
    });

    it('should move accessed items to the end', () => {
        const cache = new LRUCache(3);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.set('c', 3);

        cache.get('a');

        cache.set('d', 4);

        expect(cache.get('a')).toBe(1);
        expect(cache.get('b')).toBe(null);
    });

    it('should check existence with has()', () => {
        const cache = new LRUCache(10);
        cache.set('key1', 'value1');
        expect(cache.has('key1')).toBe(true);
        expect(cache.has('nonexistent')).toBe(false);
    });

    it('should delete entries', () => {
        const cache = new LRUCache(10);
        cache.set('key1', 'value1');
        cache.delete('key1');
        expect(cache.get('key1')).toBe(null);
    });

    it('should clear all entries', () => {
        const cache = new LRUCache(10);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.clear();
        expect(cache.size).toBe(0);
    });

    it('should update existing keys', () => {
        const cache = new LRUCache(10);
        cache.set('key1', 'old');
        cache.set('key1', 'new');
        expect(cache.get('key1')).toBe('new');
    });

    it('should respect TTL and expire entries', () => {
        const cache = new LRUCache(10, 100);

        cache.set('short', 'value', 50);
        cache.set('long', 'value', 5000);

        const now = Date.now();
        const originalNow = Date.now;

        Date.now = () => now + 60;

        expect(cache.get('short')).toBe(null);
        expect(cache.get('long')).toBe('value');

        Date.now = originalNow;
    });

    it('should report correct size', () => {
        const cache = new LRUCache(10);
        expect(cache.size).toBe(0);
        cache.set('a', 1);
        expect(cache.size).toBe(1);
        cache.set('b', 2);
        expect(cache.size).toBe(2);
    });
});
