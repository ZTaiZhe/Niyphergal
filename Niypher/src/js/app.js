import { ImagePreloader } from './modules/data.js';
import { SearchSuggestion } from './modules/search.js';
import { ThemeManager } from './modules/theme.js';
import { router, updateNav, showAnnouncement } from './modules/router.js';
import { DB } from './modules/data.js';
import { debounce, escapeHtml, showNotification } from './modules/utils.js';
import { CONFIG } from './modules/config.js';
import { ErrorHandler } from './modules/errorHandler.js';
import { EventDelegation } from './modules/eventDelegation.js';
import { Store, authFlowState } from './modules/store.js';
import { initRipple } from './modules/ripple.js';
import { initFormKeyboardHandler } from './modules/form.js';
import { retryLastSearch } from './modules/renderer.js';
import { DeviceDetector, ResponsiveHeader, MobileSearch, LogoMenu } from './modules/uiComponents.js';
import { lockRuntimePrototypes } from './modules/antiTamper.js';
import { initTrustedTypes } from './modules/securityTrustedTypes.js';
import preloadEngine from './modules/preloadEngine.js';
import telemetry from './modules/telemetry.js';
import deviceDetector from './modules/deviceDetector.js';
import { initHomeAnimations } from './pages/home.js';
import { performHeroExit, getHeroExitContext } from './modules/animationHelpers.js';
import { initCarousel } from './modules/carousel.js';

export { MobileSearch, LogoMenu };
// Keep refs alive for _hideL setTimeout closure
const _animHooks = { initHomeAnimations, initCarousel };

function parseInitialRoute() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
        const match = hash.match(/^#\/?(\w+)(?:\?(.*))?$/);
        if (match) {
            const page = match[1];
            const params = {};
            if (match[2]) {
                const searchParams = new URLSearchParams(match[2]);
                searchParams.forEach((value, key) => {
                    params[key] = value;
                });
            }
            return { page, params };
        }
    }
    return { page: 'home', params: {} };
}

function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    if (!scrollToTopBtn) {return;}

    scrollToTopBtn.addEventListener('click', () => {
        const mainContainer = document.getElementById('main-container');
        if (mainContainer) {
            mainContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

document.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) {return;}

    switch (action) {
    case 'logo-menu-toggle':
        if (document.body.classList.contains('is-detail-page')) {
            LogoMenu.close();
            var ctx = getHeroExitContext();
            if (ctx) {
                performHeroExit(router);
            } else {
                router.push('home');
            }
        } else {
            LogoMenu.toggle();
        }
        break;
    case 'logo-menu-home':
        LogoMenu.goHome();
        break;
    case 'logo-menu-random':
        LogoMenu.randomGame();
        break;
    case 'logo-menu-help':
        LogoMenu.openHelp();
        break;
    case 'logo-menu-community':
        LogoMenu.openCommunity();
        break;
    case 'logo-menu-feedback':
        LogoMenu.openFeedback();
        break;
    case 'mobile-search-open':
        MobileSearch.open();
        break;
    case 'mobile-search-close':
        MobileSearch.close();
        break;
    case 'toggle-theme':
        ThemeManager.toggleTheme();
        break;
    case 'nav-category':
        router.push('category');
        break;
    case 'nav-galgame':
        router.push('galgame');
        break;
    case 'nav-profile':
        router.push('profile');
        break;
    case 'search-back-home':
        router.push('home');
        break;
    case 'navigate-home':
        var ctx = getHeroExitContext();
        if (ctx) {
            performHeroExit(router);
        } else {
            router.push('home');
        }
        break;
    case 'search-retry':
        if (typeof retryLastSearch === 'function') {
            retryLastSearch();
        }
        break;
    case 'search-reload':
        window.location.reload();
        break;
    }

    const menu = document.getElementById('logo-menu');
    const button = e.target.closest('#logo-container button');

    if (LogoMenu.isOpen && !menu.contains(e.target) && !button) {
        LogoMenu.close();
    }
});

async function initApp() {
    const MIN_DUR = 2000, LOADER_TIMEOUT = 10000;
    let _loader = document.getElementById('app-loader'),
        _loaderN = document.getElementById('loader-normal'),
        _loaderT = document.getElementById('loader-timeout'),
        _loaderE = document.getElementById('loader-error'),
        _t0 = Date.now(), _timer = null;
    function _hideL() {
        if (_timer) clearTimeout(_timer);
        _setProgress(100);
        let r = Math.max(0, MIN_DUR - (Date.now() - _t0));
        let delay = Math.max(r, 350);
        setTimeout(function() {
            _loader && _loader.classList.add('hidden');
            setTimeout(function() {
                if (_animHooks.initHomeAnimations) _animHooks.initHomeAnimations();
                if (_animHooks.initCarousel) _animHooks.initCarousel();
            }, 100);
        }, delay);
    }
    function _showT() {
        _loaderN && _loaderN.classList.add('hidden');
        _loaderT && _loaderT.classList.remove('hidden');
    }
    function _showE() {
        if (_timer) clearTimeout(_timer);
        _loaderN && _loaderN.classList.add('hidden');
        _loaderT && _loaderT.classList.add('hidden');
        _loaderE && _loaderE.classList.remove('hidden');
    }
    function _setProgress(pct) { console.debug("[Loader] progress:", pct + "%");
        var fill = document.getElementById('loader-progress-fill');
        if (!fill) return;
        if (pct === 0) { fill.style.transition = 'none'; fill.style.width = '0%'; void fill.offsetHeight; fill.style.transition = ''; }
        else { fill.style.width = pct + '%'; }
    }
    _setProgress(2);
    _timer = setTimeout(_showT, LOADER_TIMEOUT);
    let _rb = document.getElementById('loader-retry-btn');
    if (_rb) _rb.addEventListener('click', function() { location.reload(); });
    try {
    if (!window.__NPHER_V2) {
        window.__NPHER_V2 = {
            pageKeepAlive: true,
            animationEnd: true,
            skeletonScreen: true,
            gpuAccel: true,
            lazyGallery: true,
            xpathScraper: true,
            scrollContain: true,
            detailV2: false,
            preloadEngine: true,
            chunkDownloader: true,
            strictSanitize: true,
            antiTamper: true,
            trustedTypes: true,
            telemetry: true,
        };
    }
    if (localStorage.getItem('niypher_v2_override') === '0') {
        Object.keys(window.__NPHER_V2).forEach(k => { window.__NPHER_V2[k] = false; });
    }

    _setProgress(10);

    deviceDetector.init();

    if (deviceDetector.isMobile) {
        document.body.classList.add('is-mobile-device');
    }
    if (deviceDetector.isTablet) {
        document.body.classList.add('is-tablet-device');
    }

    ErrorHandler.init();
    EventDelegation.init();
    initRipple();
    initFormKeyboardHandler();
    initScrollToTop();

    initTrustedTypes();
    lockRuntimePrototypes();

    telemetry.init({ debug: false, autoBatch: true });
    preloadEngine.init();
    preloadEngine.initStaticPrefetch();
    _setProgress(20);

    await Store.init();
    _setProgress(60);

    ThemeManager.initTheme();

    const initialRoute = parseInitialRoute();
    router.push(initialRoute.page, initialRoute.params);

    document.documentElement.classList.add(
        deviceDetector.isMobile ? 'layout-mobile' : 'layout-desktop'
    );
    if (deviceDetector.isTablet) {
        document.documentElement.classList.add('layout-tablet');
    }

    window.addEventListener('device:changed', (e) => {
        const { isMobile, isDesktop, isTablet } = e.detail || deviceDetector;
        document.documentElement.classList.toggle('layout-mobile', isMobile);
        document.documentElement.classList.toggle('layout-desktop', isDesktop);
        document.documentElement.classList.toggle('layout-tablet', isTablet);
    });

    SearchSuggestion.init();
    _setProgress(80);

    const headerSearchBtn = document.getElementById('header-search-btn');
    if (headerSearchBtn) {
        headerSearchBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('header-search');
            if (searchInput) {
                const query = searchInput.value.trim();
                if (query) {
                    SearchSuggestion.clearSuggestions();
                }
            }
        });
    }

    ImagePreloader.init();

    ResponsiveHeader.init();

    const mainContainer = document.getElementById('main-container');
    if (mainContainer) {
        const observer = new MutationObserver(() => {
            const galSearch = document.getElementById('gal-search');
            if (galSearch && !galSearch.hasAttribute('data-event-bound')) {
                galSearch.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        showNotification('搜索功能开发中', 'info');
                    }
                });
                galSearch.setAttribute('data-event-bound', 'true');
            }
            const cardsContainer = mainContainer.querySelector('.game-cards-container');
            if (cardsContainer && !cardsContainer.dataset.gridObserverAttached) {
                initResizeObserverGrid(cardsContainer);
                cardsContainer.dataset.gridObserverAttached = 'true';
            }
        });

        observer.observe(mainContainer, { childList: true, subtree: true });
    }
    } catch (e) {
        console.error('Init failed:', e);
        _showE();
        return;
    }

    _hideL();
}

function initResizeObserverGrid(container) {
    const columns = (w) => w <= 480 ? 2 : w <= 768 ? (w <= 600 ? 2 : 3) : w <= 1200 ? (w <= 960 ? 3 : 4) : 4;
    new ResizeObserver(entries => {
        for (const entry of entries) {
            const col = columns(entry.contentRect.width);
            entry.target.style.gridTemplateColumns = `repeat(${col}, minmax(0, 1fr))`;
        }
    }).observe(container);
}

window.addEventListener('load', initApp);
