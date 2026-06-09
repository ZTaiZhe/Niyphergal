const CACHE_CONFIG = {
    MAX_PAGES: 4,
    CACHEABLE_PAGES: ['home', 'category', 'galgame', 'profile']
};

const pageCache = new Map();
const pageScrollPositions = new Map();

export function cachePage(pageName, container) {
    if (!CACHE_CONFIG.CACHEABLE_PAGES.includes(pageName)) {
        return;
    }

    const clonedContent = container.cloneNode(true);
    clonedContent.style.display = 'none';
    clonedContent.setAttribute('data-cached-page', pageName);

    if (pageCache.has(pageName)) {
        const oldCached = pageCache.get(pageName);
        if (oldCached.parentNode) {
            oldCached.parentNode.removeChild(oldCached);
        }
    }

    pageCache.set(pageName, clonedContent);

    pageScrollPositions.set(pageName, window.scrollY);
}

export function getCachedPage(pageName) {
    if (!CACHE_CONFIG.CACHEABLE_PAGES.includes(pageName)) {
        return null;
    }

    const cachedContent = pageCache.get(pageName);

    if (cachedContent) {
        const restoredContent = cachedContent.cloneNode(true);
        restoredContent.style.display = '';
        restoredContent.removeAttribute('data-cached-page');
        return {
            content: restoredContent,
            scrollPosition: pageScrollPositions.get(pageName) || 0
        };
    }

    return null;
}

export function hasCachedPage(pageName) {
    return pageCache.has(pageName) && CACHE_CONFIG.CACHEABLE_PAGES.includes(pageName);
}

export function clearPageCache(pageName) {
    if (pageName) {
        pageCache.delete(pageName);
        pageScrollPositions.delete(pageName);
    } else {
        pageCache.clear();
        pageScrollPositions.clear();
    }
}

export function invalidateCache(pageName) {
    if (pageName) {
        pageCache.delete(pageName);
    }
}

export function getCacheStats() {
    return {
        cachedPages: Array.from(pageCache.keys()),
        scrollPositions: Object.fromEntries(pageScrollPositions),
        maxSize: CACHE_CONFIG.MAX_PAGES
    };
}

export default {
    cachePage,
    getCachedPage,
    hasCachedPage,
    clearPageCache,
    invalidateCache,
    getCacheStats
};
