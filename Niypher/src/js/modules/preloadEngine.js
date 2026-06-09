import telemetry from './telemetry.js';

class LRUMap {
    constructor(maxSize = 50) {
        this._maxSize = maxSize;
        this._cache = new Map();
    }

    get(key) {
        if (!this._cache.has(key)) return undefined;
        const value = this._cache.get(key);
        this._cache.delete(key);
        this._cache.set(key, value);
        return value;
    }

    set(key, value) {
        if (this._cache.has(key)) {
            this._cache.delete(key);
        } else if (this._cache.size >= this._maxSize) {
            const eldest = this._cache.keys().next().value;
            this._cache.delete(eldest);
        }
        this._cache.set(key, value);
    }

    has(key) {
        return this._cache.has(key);
    }

    get size() {
        return this._cache.size;
    }

    clear() {
        this._cache.clear();
    }
}

class PreloadEngine {
    constructor() {
        this._cache = new LRUMap(50);
        this._hoverTimers = new Map();
        this._activeCard = null;
        this._enabled = false;
        this._initialized = false;
    }

    init() {
        if (this._initialized) return;

        if (!window.__NPHER_V2 || !window.__NPHER_V2.preloadEngine) {
            this._enabled = false;
            this._initialized = true;
            return;
        }

        this._enabled = true;

        document.addEventListener('mouseover', (e) => {
            this._handleHoverIntent(e);
        }, { passive: true });

        document.addEventListener('mouseleave', (e) => {
            if (this._activeCard && !this._activeCard.contains(e.relatedTarget)) {
                this._cancelHover();
            }
        }, { passive: true });

        document.addEventListener('touchstart', (e) => {
            this._handleTouchIntent(e);
        }, { passive: true });

        this._initialized = true;
    }

    _handleHoverIntent(event) {
        if (!this._enabled || this._shouldSkipPreload()) return;

        const card = event.target.closest('[data-hero-id]');
        if (!card) return;

        if (this._activeCard === card) return;
        this._cancelHover();

        this._activeCard = card;

        const timer = setTimeout(() => {
            const gameId = card.dataset.heroId;
            if (gameId) {
                this._executePreload(gameId, card);
            }
            this._hoverTimers.delete(card);
        }, 120);

        this._hoverTimers.set(card, timer);
    }

    _handleTouchIntent(event) {
        if (!this._enabled) return;

        const card = event.target.closest('[data-hero-id]');
        if (!card) return;

        const gameId = card.dataset.heroId;
        if (gameId) {
            this._executePreload(gameId, card);
        }
    }

    _cancelHover() {
        if (this._activeCard) {
            const timer = this._hoverTimers.get(this._activeCard);
            if (timer) {
                clearTimeout(timer);
                this._hoverTimers.delete(this._activeCard);
            }
            this._activeCard = null;
        }
    }

    _shouldSkipPreload() {
        if (navigator.connection) {
            if (navigator.connection.saveData) return true;
            if (navigator.connection.effectiveType === 'slow-2g' ||
                navigator.connection.effectiveType === '2g' ||
                navigator.connection.effectiveType === '3g') {
                return true;
            }
        }
        return false;
    }

    async _executePreload(gameId, card) {
        const cacheKey = `detail:${gameId}`;

        if (this._cache.has(cacheKey)) {
            return;
        }

        this._cache.set(cacheKey, { status: 'loading' });

        try {
            const url = `#/detail?id=${gameId}`;
            const response = await fetch(url, {
                priority: 'low',
                headers: { 'sec-purpose': 'prefetch' }
            });
            this._cache.set(cacheKey, { status: 'loaded', timestamp: Date.now() });

            if (telemetry) {
                telemetry.track({
                    type: 'preload',
                    name: 'preload_success',
                    data: { gameId, cacheSize: this._cache.size }
                });
            }
        } catch (e) {
            this._cache.set(cacheKey, { status: 'error', error: e.message });
        }
    }

    checkCache(gameId) {
        const cacheKey = `detail:${gameId}`;
        if (this._cache.has(cacheKey)) {
            const entry = this._cache.get(cacheKey);
            if (entry.status === 'loaded') {
                if (telemetry) {
                    telemetry.track({
                        type: 'preload',
                        name: 'preload_hit',
                        data: { gameId }
                    });
                }
                return true;
            }
        }
        if (telemetry) {
            telemetry.track({
                type: 'preload',
                name: 'preload_miss',
                data: { gameId }
            });
        }
        return false;
    }

    initStaticPrefetch() {
        if (!this._enabled) return;

        if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(() => {
                this._injectStaticPrefetch();
            }, { timeout: 2000 });
        } else {
            setTimeout(() => this._injectStaticPrefetch(), 2000);
        }
    }

    _injectStaticPrefetch() {
        const assets = [
            { href: '/src/js/pages/detail.js', as: 'script' },
            { href: '/src/js/pages/search.js', as: 'script' },
        ];

        assets.forEach(({ href, as }) => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = as;
            link.href = href;
            document.head.appendChild(link);
        });
    }

    getCacheStats() {
        return {
            size: this._cache.size,
            enabled: this._enabled
        };
    }

    destroy() {
        this._cancelHover();
        this._hoverTimers.forEach(timer => clearTimeout(timer));
        this._hoverTimers.clear();
        this._cache.clear();
        this._initialized = false;
    }
}

const preloadEngine = new PreloadEngine();

export { preloadEngine, PreloadEngine };
export default preloadEngine;
