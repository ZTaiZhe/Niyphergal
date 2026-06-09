import { CONFIG } from './config.js';
import { processResults } from './searchHelper.js';

const SWR_CACHE_TTL = 3 * 60 * 1000;
const SWR_REVALIDATE_TTL = 5 * 60 * 1000;
const SKELETON_DEBOUNCE_MS = 200;
const ANIMATION_DURATION_MS = 250;

class SWRCache {
    constructor(ttl = SWR_CACHE_TTL, revalidateTtl = SWR_REVALIDATE_TTL) {
        this.cache = new Map();
        this.timestamps = new Map();
        this.staleTimestamps = new Map();
        this.ttl = ttl;
        this.revalidateTtl = revalidateTtl;
    }

    _hashParams(params) {
        const keys = Object.keys(params).sort();
        const parts = keys.map(k => {
            const v = params[k];
            if (v === undefined || v === null || v === '') {return null;}
            return `${k}=${encodeURIComponent(String(v))}`;
        }).filter(Boolean);
        return parts.join('&');
    }

    get(params) {
        const key = this._hashParams(params);
        if (!this.cache.has(key)) {
            return { hit: false, data: null, stale: false };
        }

        const timestamp = this.timestamps.get(key);
        const now = Date.now();
        const age = now - timestamp;

        if (age > this.revalidateTtl) {
            this.cache.delete(key);
            this.timestamps.delete(key);
            this.staleTimestamps.delete(key);
            return { hit: false, data: null, stale: false };
        }

        const stale = age > this.ttl;
        return { hit: true, data: this.cache.get(key), stale };
    }

    set(params, data) {
        const key = this._hashParams(params);
        const now = Date.now();
        this.cache.set(key, data);
        this.timestamps.set(key, now);
        this.staleTimestamps.set(key, false);
    }

    has(params) {
        const key = this._hashParams(params);
        if (!this.cache.has(key)) {return false;}

        const timestamp = this.timestamps.get(key);
        if (Date.now() - timestamp > this.revalidateTtl) {
            this.cache.delete(key);
            this.timestamps.delete(key);
            this.staleTimestamps.delete(key);
            return false;
        }
        return true;
    }

    clear() {
        this.cache.clear();
        this.timestamps.clear();
        this.staleTimestamps.clear();
    }

    getStats() {
        return {
            size: this.cache.size,
            ttl: this.ttl,
            revalidateTtl: this.revalidateTtl
        };
    }

    cleanup() {
        const now = Date.now();
        const keysToDelete = [];

        for (const [key, timestamp] of this.timestamps) {
            if (now - timestamp > this.revalidateTtl) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => {
            this.cache.delete(key);
            this.timestamps.delete(key);
            this.staleTimestamps.delete(key);
        });

        return keysToDelete.length;
    }
}

class SearchOrchestrator {
    constructor() {
        this._abortController = null;
        this._currentRequestId = 0;
        this._swrCache = new SWRCache();
        this._isAnimating = false;
        this._isProcessing = false;
        this._skeletonTimer = null;
        this._showSkeleton = false;
        this._buttonsDisabled = false;
        this._animationPromise = null;
        this._requestStartTime = 0;
        this._cleanupInterval = null;
    }

    init() {
        this._cleanupInterval = setInterval(() => {
            this._swrCache.cleanup();
        }, 60 * 1000);

        window.addEventListener('beforeunload', () => {
            this.destroy();
        });
    }

    destroy() {
        if (this._cleanupInterval) {
            clearInterval(this._cleanupInterval);
            this._cleanupInterval = null;
        }
        this.abort();
        this._swrCache.clear();
    }

    abort() {
        if (this._abortController) {
            this._abortController.abort();
            this._abortController = null;
        }
        this._clearSkeletonTimer();
        this._isProcessing = false;
    }

    _clearSkeletonTimer() {
        if (this._skeletonTimer) {
            clearTimeout(this._skeletonTimer);
            this._skeletonTimer = null;
        }
        this._showSkeleton = false;
    }

    _createAbortController() {
        if (this._abortController) {
            this._abortController.abort();
        }
        this._abortController = new AbortController();
        return this._abortController;
    }

    _checkAborted(signal) {
        if (signal && signal.aborted) {
            const error = new Error('Request aborted');
            error.name = 'AbortError';
            throw error;
        }
    }

    async _waitForAnimation(signal) {
        return new Promise((resolve, reject) => {
            const abortHandler = () => {
                reject(new Error('Request aborted'));
            };

            if (signal) {
                signal.addEventListener('abort', abortHandler);
            }

            const container = document.getElementById('main-container');
            if (!container || !this._isAnimating) {
                if (signal) {
                    signal.removeEventListener('abort', abortHandler);
                }
                resolve();
                return;
            }

            const onTransitionEnd = (e) => {
                if (e.target === container) {
                    container.removeEventListener('transitionend', onTransitionEnd);
                    container.removeEventListener('animationend', onTransitionEnd);
                    if (signal) {
                        signal.removeEventListener('abort', abortHandler);
                    }
                    resolve();
                }
            };

            container.addEventListener('transitionend', onTransitionEnd);
            container.addEventListener('animationend', onTransitionEnd);

            setTimeout(() => {
                container.removeEventListener('transitionend', onTransitionEnd);
                container.removeEventListener('animationend', onTransitionEnd);
                if (signal) {
                    signal.removeEventListener('abort', abortHandler);
                }
                resolve();
            }, ANIMATION_DURATION_MS + 50);
        });
    }

    _startSkeletonDebounce() {
        this._clearSkeletonTimer();
        this._showSkeleton = false;

        this._skeletonTimer = setTimeout(() => {
            if (this._isProcessing && !this._isAnimating) {
                this._showSkeleton = true;
                this._emitSkeletonState(true);
            }
        }, SKELETON_DEBOUNCE_MS);
    }

    _emitSkeletonState(show) {
        const event = new CustomEvent('search:skeleton', {
            detail: { show }
        });
        document.dispatchEvent(event);
    }

    _emitStateChange(state) {
        const event = new CustomEvent('search:stateChange', {
            detail: state
        });
        document.dispatchEvent(event);
    }

    _setButtonsDisabled(disabled) {
        this._buttonsDisabled = disabled;

        const buttons = document.querySelectorAll('.sort-btn, .filter-btn, .filter-btn-mobile, .order-toggle-btn');
        buttons.forEach(btn => {
            if (disabled) {
                btn.setAttribute('disabled', 'true');
                btn.classList.add('pointer-events-none', 'opacity-50');
            } else {
                btn.removeAttribute('disabled');
                btn.classList.remove('pointer-events-none', 'opacity-50');
            }
        });

        this._emitStateChange({ buttonsDisabled: disabled });
    }

    async executeSearch(params, options = {}) {
        const {
            skipCache = false,
            forceRefresh = false,
            onSkeleton = null,
            onResult = null,
            onError = null
        } = options;

        const requestId = ++this._currentRequestId;
        const abortController = this._createAbortController();
        const signal = abortController.signal;

        this._isProcessing = true;
        this._requestStartTime = Date.now();

        try {
            const cacheResult = this._swrCache.get(params);

            if (!skipCache && cacheResult.hit && !forceRefresh) {
                this._setButtonsDisabled(false);
                this._isProcessing = false;

                return {
                    data: cacheResult.data,
                    fromCache: true,
                    stale: cacheResult.stale,
                    requestId
                };
            }

            this._startSkeletonDebounce();

            const searchPromise = this._performSearch(params, signal);

            if (this._isAnimating) {
                try {
                    await Promise.all([
                        this._waitForAnimation(signal),
                        searchPromise
                    ]);
                } catch (e) {
                    if (e.name === 'AbortError' || e.message === 'Request aborted') {
                        throw e;
                    }
                }
            }

            const result = await searchPromise;

            this._checkAborted(signal);

            if (requestId !== this._currentRequestId) {
                return { aborted: true, requestId };
            }

            this._swrCache.set(params, result);

            this._clearSkeletonTimer();
            if (this._showSkeleton) {
                this._emitSkeletonState(false);
            }

            this._setButtonsDisabled(false);
            this._isProcessing = false;

            if (onResult) {
                onResult(result);
            }

            return {
                data: result,
                fromCache: false,
                stale: false,
                requestId,
                elapsed: Date.now() - this._requestStartTime
            };

        } catch (error) {
            if (error.name === 'AbortError' || error.message === 'Request aborted') {
                return { aborted: true, requestId };
            }

            this._clearSkeletonTimer();
            this._emitSkeletonState(false);
            this._setButtonsDisabled(false);
            this._isProcessing = false;

            if (onError) {
                onError(error);
            }

            throw error;
        }
    }


    async _performSearch(params, signal) {
        this._checkAborted(signal);

        const keyword = params.q || '';
        const sortKey = params.sort || '';
        const order = params.order || 'desc';
        const filterType = params.filter || '';

        if (keyword.trim() === '') {
            return {
                games: [],
                keyword: '',
                sortKey,
                order,
                filterType,
                isEmpty: true
            };
        }

        this._checkAborted(signal);

        const apiUrl = new URL(CONFIG.API.BASE_URL + '/search');
        apiUrl.searchParams.set('q', keyword);
        if (sortKey) apiUrl.searchParams.set('sort', sortKey);
        if (order) apiUrl.searchParams.set('order', order);
        if (filterType) apiUrl.searchParams.set('filter', filterType);

        const response = await fetch(apiUrl.toString(), { signal });

        if (!response.ok) {
            throw new Error('Search API error: ' + response.status);
        }

        const json = await response.json();

        if (!json.success) {
            throw new Error(json.error || 'Search API error');
        }

        const games = json.games || [];
        const processedGames = processResults(games, sortKey, filterType, order);

        return {
            games: processedGames,
            keyword: json.keyword || keyword,
            sortKey: json.sortKey || sortKey,
            order: json.order || order,
            filterType: json.filterType || filterType,
            total: json.total != null ? json.total : processedGames.length,
            isEmpty: games.length === 0
        };
    }

    startAnimation() {
        this._isAnimating = true;
    }

    endAnimation() {
        this._isAnimating = false;
    }

    isProcessing() {
        return this._isProcessing;
    }

    isButtonsDisabled() {
        return this._buttonsDisabled;
    }

    shouldShowSkeleton() {
        return this._showSkeleton;
    }

    getCacheStats() {
        return this._swrCache.getStats();
    }

    clearCache() {
        this._swrCache.clear();
    }

    hasCache(params) {
        return this._swrCache.has(params);
    }

    getCacheEntry(params) {
        return this._swrCache.get(params);
    }
}

export const searchOrchestrator = new SearchOrchestrator();

export default SearchOrchestrator;