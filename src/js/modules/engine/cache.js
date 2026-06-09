import { CONFIG } from '../foundation/config.js';

export const CACHE_CONFIG = {
    MAX_SIZE: CONFIG.SEARCH.CACHE_MAX_SIZE,
    TTL: CONFIG.SEARCH.CACHE_TTL_MINUTES * 60 * 1000
};

export class LRUCache {
    constructor(maxSize = CACHE_CONFIG.MAX_SIZE, ttl = CACHE_CONFIG.TTL) {
        this.maxSize = maxSize;
        this.ttl = ttl;
        this.cache = new Map();
        this.accessOrder = [];
        this.timestamps = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) {
            return undefined;
        }

        if (this.isExpired(key)) {
            this.delete(key);
            return undefined;
        }

        this.updateAccessOrder(key);
        return this.cache.get(key);
    }

    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.set(key, value);
            this.timestamps.set(key, Date.now());
            this.updateAccessOrder(key);
            return;
        }

        while (this.cache.size >= this.maxSize) {
            this.evictLRU();
        }

        this.cache.set(key, value);
        this.timestamps.set(key, Date.now());
        this.accessOrder.push(key);
    }

    has(key) {
        if (!this.cache.has(key)) {
            return false;
        }

        if (this.isExpired(key)) {
            this.delete(key);
            return false;
        }

        return true;
    }

    delete(key) {
        this.cache.delete(key);
        this.timestamps.delete(key);
        const index = this.accessOrder.indexOf(key);
        if (index > -1) {
            this.accessOrder.splice(index, 1);
        }
    }

    clear() {
        this.cache.clear();
        this.timestamps.clear();
        this.accessOrder = [];
    }

    get size() {
        return this.cache.size;
    }

    isExpired(key) {
        const timestamp = this.timestamps.get(key);
        if (!timestamp) {return true;}
        return Date.now() - timestamp > this.ttl;
    }

    updateAccessOrder(key) {
        const index = this.accessOrder.indexOf(key);
        if (index > -1) {
            this.accessOrder.splice(index, 1);
        }
        this.accessOrder.push(key);
    }

    evictLRU() {
        if (this.accessOrder.length === 0) {return;}

        const lruKey = this.accessOrder.shift();
        this.cache.delete(lruKey);
        this.timestamps.delete(lruKey);
    }

    cleanup() {
        const now = Date.now();
        const keysToDelete = [];

        for (const [key, timestamp] of this.timestamps) {
            if (now - timestamp > this.ttl) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => this.delete(key));

        return keysToDelete.length;
    }

    getStats() {
        let expiredCount = 0;
        for (const [key] of this.cache) {
            if (this.isExpired(key)) {
                expiredCount++;
            }
        }

        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            expiredCount: expiredCount,
            ttl: this.ttl
        };
    }
}

export function createSearchCache(maxSize = 50, ttlMinutes = 5) {
    return new LRUCache(maxSize, ttlMinutes * 60 * 1000);
}

export default LRUCache;
