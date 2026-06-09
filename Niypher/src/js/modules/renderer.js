import { waitForAnimationEnd, clearHeroExitContext, isHeroExitInFlight, getHeroExitContext } from './animationHelpers.js';
import { DB } from './data.js';
import { renderHome, renderHomeSkeleton, initHomeAnimations, revealHomeCardsImmediately, revealFlownCard } from '../pages/home.js';
import { initCarousel } from './carousel.js';
import { renderCategory, renderCategorySkeleton } from '../pages/category.js';
import { renderGalgame, renderGalgameSkeleton } from '../pages/galgame.js';
import { renderProfile, renderProfileSkeleton } from '../pages/profile.js';
import { renderDetail, renderDetailSkeleton, initDetailAnimations, revealDetailContent, setHeroTransition, getHeroTransition } from '../pages/detail.js';
import { renderSearch, renderSearchResults, updateFilterButtons, renderSearchSkeleton, renderCardsSkeleton, renderNetworkError, renderNoResults } from '../pages/search.js';
import { showAnnouncement } from './announcement.js';
import { bindPasswordCheck } from './authForm.js';
import { observeExistingMedia } from './mediaLoader.js';
import { searchOrchestrator } from './searchOrchestrator.js';
import { telemetry } from './telemetry.js';

const pageOrder = {
    home: 0,
    category: 1,
    galgame: 2,
    search: 3,
    profile: 4,
    detail: 5
};

const RenderState = {
    IDLE: 'IDLE',
    UPDATING: 'UPDATING',
    ENTERING: 'ENTERING'
};

const LCP_IMAGE_COUNT = 3;
const ENTERING_ANIMATION_DURATION = 300;
const LEAVING_ANIMATION_DURATION = 250;
const SEARCH_PAGE_ENTER_DURATION = 400;
const SEARCH_PAGE_EXIT_DURATION = 350;

class RenderStateMachine {
    constructor() {
        this._state = RenderState.IDLE;
        this._previousState = null;
        this._stateChangeCallbacks = [];
        this._errorState = false;
        this._lastValidParams = null;
    }

    get state() {
        return this._state;
    }

    get isError() {
        return this._errorState;
    }

    get lastValidParams() {
        return this._lastValidParams;
    }

    setLastValidParams(params) {
        this._lastValidParams = params ? { ...params } : null;
    }

    canTransition(toState) {
        const transitions = {
            [RenderState.IDLE]: [RenderState.UPDATING],
            [RenderState.UPDATING]: [RenderState.ENTERING, RenderState.IDLE],
            [RenderState.ENTERING]: [RenderState.IDLE]
        };
        return transitions[this._state]?.includes(toState) ?? false;
    }

    transition(toState, force = false) {
        if (!force && !this.canTransition(toState)) {
            console.warn(`Invalid state transition: ${this._state} -> ${toState}`);
            return false;
        }

        this._previousState = this._state;
        this._state = toState;
        this._notifyStateChange(toState);
        return true;
    }

    setError(isError) {
        this._errorState = isError;
    }

    reset() {
        this._state = RenderState.IDLE;
        this._errorState = false;
    }

    onStateChange(callback) {
        this._stateChangeCallbacks.push(callback);
        return () => {
            const index = this._stateChangeCallbacks.indexOf(callback);
            if (index > -1) {
                this._stateChangeCallbacks.splice(index, 1);
            }
        };
    }

    _notifyStateChange(newState) {
        this._stateChangeCallbacks.forEach(cb => {
            try {
                cb(newState, this._previousState);
            } catch (e) {
                console.error('State change callback error:', e);
            }
        });
    }
}

class DOMOptimizer {
    constructor() {
        this._mountedComponents = new WeakMap();
        this._cleanupCallbacks = new Map();
    }

    createFragment() {
        return document.createDocumentFragment();
    }

    batchAppend(container, elements) {
        const fragment = this.createFragment();
        elements.forEach(el => {
            if (el instanceof Node) {
                fragment.appendChild(el);
            } else if (typeof el === 'string') {
                const template = document.createElement('template');
                template.innerHTML = el.trim();
                fragment.appendChild(template.content);
            }
        });
        container.appendChild(fragment);
        return fragment;
    }

    registerCleanup(element, cleanupFn) {
        if (!element) {return;}

        const elementId = this._getElementId(element);
        this._cleanupCallbacks.set(elementId, cleanupFn);
    }

    cleanupElement(element) {
        if (!element) {return;}

        const elementId = this._getElementId(element);
        const cleanupFn = this._cleanupCallbacks.get(elementId);

        if (cleanupFn) {
            try {
                cleanupFn(element);
            } catch (e) {
                console.error('Cleanup callback error:', e);
            }
            this._cleanupCallbacks.delete(elementId);
        }

        this._cleanupThirdPartyInstances(element);
        this._cleanupNonDelegatedEvents(element);
    }

    cleanupContainer(container) {
        if (!container) {return;}

        const children = container.children;
        for (let i = children.length - 1; i >= 0; i--) {
            this.cleanupElement(children[i]);
        }
    }

    _getElementId(element) {
        return element;
    }

    _cleanupThirdPartyInstances(element) {
        const instances = element.querySelectorAll('[data-component-instance]');
        instances.forEach(instance => {
            const instanceName = instance.dataset.componentInstance;
            if (instanceName && window[instanceName]) {
                try {
                    if (typeof window[instanceName].destroy === 'function') {
                        window[instanceName].destroy(instance);
                    }
                } catch (e) {
                    console.error('Third party instance cleanup error:', e);
                }
            }
        });
    }

    _cleanupNonDelegatedEvents(element) {
        const events = element.querySelectorAll('[data-bound-events]');
        events.forEach(el => {
            const boundEvents = el.dataset.boundEvents.split(',');
            boundEvents.forEach(eventType => {
                const handler = this._mountedComponents.get(el);
                if (handler && handler[eventType]) {
                    el.removeEventListener(eventType, handler[eventType]);
                }
            });
        });
    }
}

class FocusManager {
    constructor() {
        this._savedFocus = null;
    }

    saveFocusBeforeRefresh(container) {
        const activeElement = document.activeElement;
        if (activeElement && container && container.contains(activeElement)) {
            this._savedFocus = {
                element: activeElement,
                wasInContainer: true
            };
        } else {
            this._savedFocus = null;
        }
    }

    restoreFocusAfterRefresh(newContainer) {
        if (!newContainer) {return;}

        if (this._savedFocus && this._savedFocus.wasInContainer) {
            const firstFocusable = this._findFirstFocusable(newContainer);
            if (firstFocusable) {
                firstFocusable.focus({ preventScroll: true });
            } else {
                newContainer.setAttribute('tabindex', '-1');
                newContainer.focus({ preventScroll: true });
            }
        }

        this._savedFocus = null;
    }

    _findFirstFocusable(container) {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        return container.querySelector(focusableSelectors);
    }

    isFocusInElement(element) {
        const activeElement = document.activeElement;
        return element && activeElement && element.contains(activeElement);
    }
}

class ScrollManager {
    constructor() {
        this._scrollBehavior = 'smooth';
    }

    scrollToContainerTop(container) {
        if (!container) {return;}

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            container.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    scrollToTop() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            window.scrollTo({ top: 0, behavior: 'auto' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

class ARIAManager {
    setBusyState(container, isBusy) {
        if (!container) {return;}

        container.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    }

    announceLoading(container) {
        this.setBusyState(container, true);
    }

    announceLoaded(container) {
        this.setBusyState(container, false);
    }
}

class LCPOptimizer {
    constructor() {
        this._pendingImages = new Set();
        this._resolveCallback = null;
        this._timeout = null;
        this._maxWaitTime = 2000;
    }

    waitForLCPImages(container, callback) {
        this._reset();

        if (!container) {
            callback();
            return;
        }

        const cards = container.querySelectorAll('.game-card');
        const lcpCards = Array.from(cards).slice(0, LCP_IMAGE_COUNT);

        if (lcpCards.length === 0) {
            callback();
            return;
        }

        this._resolveCallback = callback;
        let loadedCount = 0;
        const totalImages = lcpCards.length;

        const checkComplete = () => {
            loadedCount++;
            if (loadedCount >= totalImages) {
                this._resolve();
            }
        };

        lcpCards.forEach(card => {
            const img = card.querySelector('img[data-src], img[src]');
            if (img) {
                if (img.complete && img.naturalHeight !== 0) {
                    checkComplete();
                } else {
                    this._pendingImages.add(img);

                    img.onload = () => {
                        this._pendingImages.delete(img);
                        checkComplete();
                    };

                    img.onerror = () => {
                        this._pendingImages.delete(img);
                        checkComplete();
                    };
                }
            } else {
                checkComplete();
            }
        });

        this._timeout = setTimeout(() => {
            this._resolve();
        }, this._maxWaitTime);
    }

    _resolve() {
        if (this._resolveCallback) {
            const callback = this._resolveCallback;
            this._reset();
            callback();
        }
    }

    _reset() {
        this._pendingImages.clear();
        this._resolveCallback = null;
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
    }
}

class EventDelegator {
    constructor() {
        this._handlers = new Map();
        this._boundHandler = this._handleEvent.bind(this);
        this._containers = new Set();
    }

    attach(container, eventType, selector, handler) {
        if (!container) {return;}

        const key = `${eventType}:${selector}`;

        if (!this._handlers.has(key)) {
            this._handlers.set(key, []);
        }

        this._handlers.get(key).push({
            container,
            selector,
            handler
        });

        if (!this._containers.has(container)) {
            container.addEventListener(eventType, this._boundHandler);
            this._containers.add(container);
        }
    }

    detach(container, eventType, selector) {
        const key = `${eventType}:${selector}`;
        const handlers = this._handlers.get(key);

        if (handlers) {
            const filtered = handlers.filter(h => h.container !== container);
            if (filtered.length === 0) {
                this._handlers.delete(key);
            } else {
                this._handlers.set(key, filtered);
            }
        }
    }

    detachAll(container) {
        if (!container) {return;}

        this._handlers.forEach((handlers, key) => {
            const filtered = handlers.filter(h => h.container !== container);
            if (filtered.length === 0) {
                this._handlers.delete(key);
            } else {
                this._handlers.set(key, filtered);
            }
        });

        container.removeEventListener('click', this._boundHandler);
        this._containers.delete(container);
    }

    _handleEvent(event) {
        const eventType = event.type;

        this._handlers.forEach((handlers, key) => {
            if (!key.startsWith(eventType + ':')) {return;}

            handlers.forEach(({ container, selector, handler }) => {
                if (!container.contains(event.target)) {return;}

                const target = event.target.closest(selector);
                if (target && container.contains(target)) {
                    handler(event, target);
                }
            });
        });
    }
}

class RenderErrorHandler {
    constructor(stateMachine, router) {
        this._stateMachine = stateMachine;
        this._router = router;
        this._retryCallback = null;
    }

    handleNetworkError(params, retryCallback) {
        this._stateMachine.setError(true);
        this._stateMachine.transition(RenderState.IDLE, true);

        this._retryCallback = retryCallback;

        const searchContainer = document.querySelector('.space-y-5');
        if (searchContainer) {
            const headerHtml = renderSearchResults(params).split('<div class="game-cards-container')[0];
            searchContainer.innerHTML = headerHtml + renderNetworkError(params.q || '');
        }

        this._restoreButtonStates(params);
    }

    handleEmptyResults(params) {
        const searchContainer = document.querySelector('.space-y-5');
        if (searchContainer) {
            const fullContent = renderSearchResults(params);
            searchContainer.innerHTML = fullContent;
        }
        updateFilterButtons(
            params.sort || '',
            params.filter || '',
            params.order || 'desc'
        );
    }

    handleServerError(params, retryCallback) {
        this.handleNetworkError(params, retryCallback);
    }

    retry() {
        if (this._retryCallback) {
            this._stateMachine.setError(false);
            this._retryCallback();
        }
    }

    _restoreButtonStates(params) {
        updateFilterButtons(
            params.sort || '',
            params.filter || '',
            params.order || 'desc'
        );
    }
}

const stateMachine = new RenderStateMachine();
const domOptimizer = new DOMOptimizer();
const lcpOptimizer = new LCPOptimizer();
const eventDelegator = new EventDelegator();
const focusManager = new FocusManager();
const scrollManager = new ScrollManager();
const ariaManager = new ARIAManager();

const renderTimeout = null;
let orchestratorInitialized = false;
let router = null;
let errorHandler = null;
let currentTelemetrySearchId = 0;
let _routerInstance = null;
let _mode = 'push';
let _boundCollapsibleCloseHandler = null;
let _stateMachineStuckTimer = null;

function ensureStateMachineIdle() {
    if (stateMachine.state !== RenderState.IDLE) {
        if (_stateMachineStuckTimer) {
            clearTimeout(_stateMachineStuckTimer);
        }
        _stateMachineStuckTimer = setTimeout(() => {
            if (stateMachine.state !== RenderState.IDLE) {
                stateMachine.transition(RenderState.IDLE, true);
            }
            _stateMachineStuckTimer = null;
        }, 1500);
        stateMachine.transition(RenderState.IDLE, true);
    }
}

function initOrchestrator() {
    if (!orchestratorInitialized) {
        searchOrchestrator.init();
        orchestratorInitialized = true;

        telemetry.init({ debug: false });

        document.addEventListener('search:skeleton', (e) => {
            const cardsContainer = document.querySelector('.game-cards-container');
            if (cardsContainer && e.detail.show) {
                cardsContainer.innerHTML = renderCardsSkeleton();
            }
        });
    }
}

function getAnimationDirection(fromIndex, toIndex) {
    if (fromIndex === undefined || toIndex === undefined || fromIndex === null || toIndex === null) {
        return { animationClass: 'animate-fade-in', oldAnimationClass: 'animate-fade-out' };
    }
    
    if (toIndex > fromIndex) {
        return { animationClass: 'animate-slide-in-right', oldAnimationClass: 'animate-slide-out-left' };
    } else if (toIndex < fromIndex) {
        return { animationClass: 'animate-slide-in-left', oldAnimationClass: 'animate-slide-out-right' };
    }
    
    return { animationClass: 'animate-fade-in', oldAnimationClass: 'animate-fade-out' };
}

function getSearchPageTransition(router, mode) {
    const isEnteringSearch = mode === 'push' && router.current === 'search' && router.previous !== 'search';
    const isLeavingSearchViaPop = mode === 'pop' && router.previous === 'search';
    const isLeavingSearchViaPush = mode === 'push' && router.previous === 'search' && router.current !== 'search';

    if (isEnteringSearch) {
        return {
            type: 'search-enter',
            enterClass: 'page-slide-up-enter-active',
            needsUnderlay: true
        };
    }

    if (isLeavingSearchViaPop) {
        return {
            type: 'search-exit-pop',
            exitClass: 'page-slide-down-exit-active',
            needsUnderlay: true
        };
    }

    if (isLeavingSearchViaPush) {
        return {
            type: 'search-exit-push',
            useDefaultSlide: true
        };
    }

    return { type: 'default' };
}

function executeEnteringAnimation(container, callback) {
    if (!container) {
        callback?.();
        return;
    }

    const cards = container.querySelectorAll('.glass-card');
    if (cards.length === 0) {
        callback?.();
        return;
    }

    cards.forEach((card, index) => {
        card.classList.add('is-entering');

        const delayIndex = Math.min(index + 1, 15);
        card.classList.add(`stagger-delay-${delayIndex}`);
    });

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            cards.forEach(card => {
                card.classList.add('is-visible');
            });
        });
    });

    const maxDelay = Math.min(cards.length, 15) * 50;
    const totalDuration = 300 + maxDelay + 50;

    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('is-entering', 'is-visible');
            for (let i = 1; i <= 15; i++) {
                card.classList.remove(`stagger-delay-${i}`);
            }
        });
        callback?.();
    }, totalDuration);
}

function executeLeavingAnimation(container, callback) {
    if (!container) {
        callback?.();
        return;
    }

    const cards = container.querySelectorAll('.glass-card');
    if (cards.length === 0) {
        callback?.();
        return;
    }

    cards.forEach((card, index) => {
        card.classList.add('is-leaving');

        const delayIndex = Math.min(index + 1, 15);
        card.classList.add(`stagger-delay-${delayIndex}`);
    });

    const maxDelay = Math.min(cards.length, 15) * 50;
    const totalDuration = 300 + maxDelay + 50;

    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('is-leaving');
            for (let i = 1; i <= 15; i++) {
                card.classList.remove(`stagger-delay-${i}`);
            }
        });
        callback?.();
    }, totalDuration);
}

async function performPartialRefresh(params, container) {
    if (stateMachine.state !== RenderState.IDLE) {
        ensureStateMachineIdle();
    }

    currentTelemetrySearchId = telemetry.trackSearchStart();

    stateMachine.transition(RenderState.UPDATING);
    stateMachine.setLastValidParams(params);

    const cardsContainer = container.querySelector('.game-cards-container');

    if (cardsContainer) {
        focusManager.saveFocusBeforeRefresh(cardsContainer);

        ariaManager.announceLoading(cardsContainer);

        domOptimizer.cleanupContainer(cardsContainer);

        await new Promise(resolve => {
            executeLeavingAnimation(cardsContainer, resolve);
        });
    }

    try {
        const result = await searchOrchestrator.executeSearch(params);

        if (result.aborted) {
            telemetry.recordAbort();
            stateMachine.transition(RenderState.IDLE, true);
            return;
        }

        if (result.fromCache) {
            telemetry.recordCacheHit();
            const headerElement = container.querySelector('.search-header');
            if (headerElement) {
                const parent = headerElement.parentElement;
                if (parent) {
                    const newContent = renderSearchResults(params);
                    parent.innerHTML = newContent;
                }
            }
            updateFilterButtons(
                params.sort || '',
                params.filter || '',
                params.order || 'desc'
            );

            const newCardsContainer = container.querySelector('.game-cards-container');
            if (newCardsContainer) {
                scrollManager.scrollToContainerTop(newCardsContainer);

                ariaManager.announceLoading(newCardsContainer);

                stateMachine.transition(RenderState.ENTERING);

                lcpOptimizer.waitForLCPImages(newCardsContainer, () => {
                    executeEnteringAnimation(newCardsContainer, () => {
                        telemetry.trackEnteringEnd(currentTelemetrySearchId);
                        telemetry.trackSearchComplete(currentTelemetrySearchId);
                        ariaManager.announceLoaded(newCardsContainer);

                        focusManager.restoreFocusAfterRefresh(newCardsContainer);

                        stateMachine.transition(RenderState.IDLE);
                    });
                });
            } else {
                stateMachine.transition(RenderState.IDLE);
            }

            observeExistingMedia();
            bindSearchControlsDelegated();
            return;
        }

        telemetry.recordCacheMiss();

        if (result.data && result.data.isEmpty) {
            if (result.data.keyword && result.data.keyword.trim() !== '') {
                errorHandler.handleEmptyResults(params);
            }
            stateMachine.transition(RenderState.IDLE);
            return;
        }

        const newContent = renderSearchResults(params);

        const fragment = document.createDocumentFragment();
        const template = document.createElement('template');
        template.innerHTML = newContent.trim();
        fragment.appendChild(template.content);

        container.innerHTML = '';
        container.appendChild(fragment);

        updateFilterButtons(
            params.sort || '',
            params.filter || '',
            params.order || 'desc'
        );

        const newCardsContainer = container.querySelector('.game-cards-container');

        if (newCardsContainer) {
            scrollManager.scrollToContainerTop(newCardsContainer);

            ariaManager.announceLoading(newCardsContainer);

            stateMachine.transition(RenderState.ENTERING);

            lcpOptimizer.waitForLCPImages(newCardsContainer, () => {
                executeEnteringAnimation(newCardsContainer, () => {
                    telemetry.trackEnteringEnd(currentTelemetrySearchId);
                    telemetry.trackSearchComplete(currentTelemetrySearchId);
                    ariaManager.announceLoaded(newCardsContainer);

                    focusManager.restoreFocusAfterRefresh(newCardsContainer);

                    stateMachine.transition(RenderState.IDLE);
                });
            });
        } else {
            stateMachine.transition(RenderState.IDLE);
        }

        observeExistingMedia();
        bindSearchControlsDelegated();

    } catch (error) {
        console.error('Partial refresh error:', error);
        telemetry.recordFallbackError();

        if (error.name === 'NetworkError' || error.message?.includes('network')) {
            errorHandler.handleNetworkError(params, () => performPartialRefresh(params, container));
        } else if (error.status >= 500) {
            errorHandler.handleServerError(params, () => performPartialRefresh(params, container));
        } else {
            stateMachine.transition(RenderState.IDLE, true);
        }
    }
}

function bindSearchControlsDelegated() {
    const container = document.getElementById('main-container');
    if (!container) {return;}

    eventDelegator.detachAll(container);

    eventDelegator.attach(container, 'click', '.sort-btn', (event, target) => {
        if (target.disabled || searchOrchestrator.isProcessing()) {
            return;
        }

        target.classList.add('btn-clicking');
        setTimeout(() => target.classList.remove('btn-clicking'), 150);

        const sortKey = target.dataset.sort;
        const currentParams = { ...router.params };

        if (sortKey === currentParams.sort) {
            delete currentParams.sort;
        } else {
            currentParams.sort = sortKey;
        }

        telemetry.trackFilterApplied(currentParams);
        router.replace('search', currentParams);
    });

    eventDelegator.attach(container, 'click', '.filter-btn', (event, target) => {
        if (target.disabled || searchOrchestrator.isProcessing()) {
            return;
        }

        target.classList.add('btn-clicking');
        setTimeout(() => target.classList.remove('btn-clicking'), 150);

        const filterType = target.dataset.filter;
        const currentParams = { ...router.params };

        if (filterType === currentParams.filter) {
            delete currentParams.filter;
        } else {
            currentParams.filter = filterType;
        }

        telemetry.trackFilterApplied(currentParams);
        router.replace('search', currentParams);
    });

    eventDelegator.attach(container, 'click', '.filter-btn-mobile', (event, target) => {
        if (target.disabled || searchOrchestrator.isProcessing()) {
            return;
        }

        target.classList.add('btn-clicking');
        setTimeout(() => target.classList.remove('btn-clicking'), 150);

        const filterType = target.dataset.filter;
        const currentParams = { ...router.params };

        if (filterType === currentParams.filter) {
            delete currentParams.filter;
        } else {
            currentParams.filter = filterType;
        }

        const collapsible = document.querySelector('.filter-group-collapsible');
        if (collapsible) {
            collapsible.classList.remove('expanded');
            const expandBtn = collapsible.querySelector('.filter-expand-btn');
            if (expandBtn) {
                expandBtn.setAttribute('aria-expanded', 'false');
            }
        }

        telemetry.trackFilterApplied(currentParams);
        router.replace('search', currentParams);
    });

    eventDelegator.attach(container, 'click', '.filter-expand-btn', (event, target) => {
        const isExpanded = target.getAttribute('aria-expanded') === 'true';
        const collapsible = document.querySelector('.filter-group-collapsible');

        target.setAttribute('aria-expanded', !isExpanded);

        if (collapsible) {
            collapsible.classList.toggle('expanded');
        }
    });

    eventDelegator.attach(container, 'click', '.order-toggle-btn', (event, target) => {
        if (target.disabled || searchOrchestrator.isProcessing()) {
            return;
        }

        target.classList.add('clicked');

        setTimeout(() => {
            target.classList.remove('clicked');
        }, 400);

        const order = target.dataset.order;
        const currentParams = { ...router.params };

        currentParams.order = order;

        const cardsContainer = document.querySelector('.game-cards-container');
        if (cardsContainer) {
            cardsContainer.classList.add('reordering');
            cardsContainer.classList.add('order-animating');

            setTimeout(() => {
                cardsContainer.classList.remove('reordering');
                cardsContainer.classList.remove('order-animating');
            }, 600);
        }

        telemetry.trackOrderToggled(order, currentParams);
        router.replace('search', currentParams);
    });

    eventDelegator.attach(container, 'click', '.btn-retry', (event, target) => {
        errorHandler.retry();
    });

    if (_boundCollapsibleCloseHandler) {
        document.removeEventListener('click', _boundCollapsibleCloseHandler);
    }

    _boundCollapsibleCloseHandler = (e) => {
        if (!e.target.closest('.filter-group-collapsible')) {
            const collapsible = document.querySelector('.filter-group-collapsible');
            const expandBtn = document.querySelector('.filter-expand-btn');
            if (collapsible && collapsible.classList.contains('expanded')) {
                collapsible.classList.remove('expanded');
                if (expandBtn) {
                    expandBtn.setAttribute('aria-expanded', 'false');
                }
            }
        }
    };
    document.addEventListener('click', _boundCollapsibleCloseHandler);
}

export function render(routerInstance, mode = 'push') {
    router = routerInstance;
    _routerInstance = routerInstance;
    _mode = mode;

    if (!errorHandler) {
        errorHandler = new RenderErrorHandler(stateMachine, router);
    }

    initOrchestrator();

    if (renderTimeout) {
        clearTimeout(renderTimeout);
    }

        const container = document.getElementById('main-container');

        /**
         * Wraps content in a section[data-page] and manages section display toggling.
         * This ensures document.querySelectorAll('[data-page]') always finds sections
         * and enables page keep-alive semantics.
         */

        const getPageSkeleton = (page) => {
            switch (page) {
                case 'home': return renderHomeSkeleton();
                case 'category': return renderCategorySkeleton();
                case 'galgame': return renderGalgameSkeleton();
                case 'detail': return renderDetailSkeleton();
                case 'profile': return renderProfileSkeleton();
                default: return null;
            }
        };
        const injectSection = (page, content) => {
            const transientContainers = container.querySelectorAll('.page-transition-container, .search-page-transition-container');
            if (transientContainers.length > 0) {
                transientContainers.forEach(el => el.remove());
            }
            const ALL_PAGES = ['home', 'category', 'galgame', 'search', 'profile', 'detail'];

            const ensureSection = (p) => {
                let sec = container.querySelector(`section[data-page="${p}"]`);
                if (!sec) {
                    sec = document.createElement('section');
                    sec.setAttribute('data-page', p);
                    sec.id = `page-${p}`;
                    sec.style.display = 'none';
                    container.appendChild(sec);
                }
                return sec;
            };

            const sections = {};
            ALL_PAGES.forEach(p => { sections[p] = ensureSection(p); });

            sections[page].innerHTML = content;
            ALL_PAGES.forEach(p => {
                sections[p].style.display = p === page ? 'block' : 'none';
            });
            container.dispatchEvent(new CustomEvent('page:rendered', { detail: { page: page } }));
        };

        const clearTransientContent = () => {
            const children = [...container.children];
            children.forEach(child => {
                if (!child.hasAttribute || !child.hasAttribute('data-page')) {
                    child.remove();
                }
            });
        };

        const oldContent = container.innerHTML;

        const sections = container.querySelectorAll('section[data-page]');
        sections.forEach(sec => sec.remove());

        if (router.previous === 'detail' && !isHeroExitInFlight()) {
            clearHeroExitContext();
        }

        if (isHeroExitInFlight() && router.current === 'home') {
            let heroExitCtx = getHeroExitContext();
            let heroExitGameId = heroExitCtx ? heroExitCtx.gameId : null;
            let heroHomeContent = renderHome('');
            injectSection('home', heroHomeContent);
            revealHomeCardsImmediately(heroExitGameId);
            document.addEventListener('hero:exit-complete', function onExitComplete(e) {
                document.removeEventListener('hero:exit-complete', onExitComplete);
                if (e.detail && e.detail.gameId) {
                    revealFlownCard(e.detail.gameId);
                }
            });
            observeExistingMedia();
            initCarousel();
            let savedScrollY = router.scrollPositions && router.scrollPositions['home'];
            if (savedScrollY !== undefined && savedScrollY !== null) {
                let mc = document.getElementById('main-container');
                if (mc) mc.scrollTop = savedScrollY;
                window.scrollTo(0, savedScrollY);
            }
            return;
        }

        const prevIndex = pageOrder[router.previous];
        const currIndex = pageOrder[router.current];

        const isProfileTransition = router.previous === 'profile' && router.current === 'profile';
        const isSearchRefresh = router.previous === 'search' && router.current === 'search';

        const searchTransition = getSearchPageTransition(router, _mode);

        let animationClass = 'animate-fade-in';
        let oldAnimationClass = '';

        if (searchTransition.type === 'search-enter') {
            animationClass = searchTransition.enterClass;
        } else if (searchTransition.type === 'search-exit-pop') {
            oldAnimationClass = searchTransition.exitClass;
        } else if (_mode === 'push' && !isProfileTransition && !isSearchRefresh) {
            const direction = getAnimationDirection(prevIndex, currIndex);
            animationClass = direction.animationClass;
            oldAnimationClass = direction.oldAnimationClass;
        }

        let newContent = '';
        let contentWithoutAnimation = '';
        let isDetailTransition = false;


        // Show skeleton placeholder instantly for all non-search pages
        const _skelContent = getPageSkeleton(router.current);
        if (_skelContent) {
            injectSection(router.current, _skelContent);
        }
        switch (router.current) {
        case 'home':
            contentWithoutAnimation = renderHome('');
            newContent = animationClass
                ? contentWithoutAnimation.replace('class="space-y-5', `class="${animationClass} space-y-5`)
                : contentWithoutAnimation;
            break;
        case 'category':
            contentWithoutAnimation = renderCategory('');
            newContent = animationClass
                ? contentWithoutAnimation.replace('class="space-y-5', `class="${animationClass} space-y-5`)
                : contentWithoutAnimation;
            break;
        case 'galgame':
            contentWithoutAnimation = renderGalgame('');
            newContent = animationClass
                ? contentWithoutAnimation.replace('class="space-y-5', `class="${animationClass} space-y-5`)
                : contentWithoutAnimation;
            break;
        case 'search':
            contentWithoutAnimation = renderSearch(router.params, '');
            newContent = animationClass
                ? contentWithoutAnimation.replace('class="space-y-5', `class="${animationClass} space-y-5`)
                : contentWithoutAnimation;
            break;
        case 'profile':
            newContent = renderProfile();
            contentWithoutAnimation = newContent;
            break;
        case 'detail':
            newContent = renderDetail(router.params.id);
            contentWithoutAnimation = newContent;
            isDetailTransition = true;
            break;
        }

        if (searchTransition.type === 'search-enter') {
            domOptimizer.cleanupContainer(container);

            const fragment = document.createDocumentFragment();
            const template = document.createElement('template');
            template.innerHTML = `
                <div class="search-page-transition-container">
                    <div class="search-page-underlay">${oldContent}</div>
                    <div class="search-page-overlay ${animationClass}">${contentWithoutAnimation}</div>
                </div>
            `.trim();
            fragment.appendChild(template.content);

            clearTransientContent();
            container.appendChild(fragment);

            const overlay = container.querySelector('.search-page-overlay');
            if (overlay) {
                void overlay.offsetHeight;
                overlay.classList.add('is-visible');
            }

            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (prefersReducedMotion) {
                injectSection(router.current, contentWithoutAnimation);
                observeExistingMedia();
                bindSearchControlsDelegated();
            } else {
                waitForAnimationEnd(overlay, SEARCH_PAGE_ENTER_DURATION).then(function() {
                    injectSection(router.current, contentWithoutAnimation);
                    observeExistingMedia();
                    bindSearchControlsDelegated();
                    let cardsContainer = container.querySelector('.game-cards-container');
                    if (cardsContainer) {
                        executeEnteringAnimation(cardsContainer);
                    }
                });
            }

        } else if (searchTransition.type === 'search-exit-pop') {
            domOptimizer.cleanupContainer(container);

            const fragment = document.createDocumentFragment();
            const template = document.createElement('template');
            template.innerHTML = `
                <div class="search-page-transition-container">
                    <div class="search-page-underlay">${contentWithoutAnimation}</div>
                    <div class="search-page-overlay ${oldAnimationClass} is-leaving">${oldContent}</div>
                </div>
            `.trim();
            fragment.appendChild(template.content);

            clearTransientContent();
            container.appendChild(fragment);

            const overlayExit = container.querySelector('.search-page-overlay');
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (prefersReducedMotion || !overlayExit) {
                injectSection(router.current, contentWithoutAnimation);
                if (router.current === 'home') { setTimeout(function() { initHomeAnimations(); initCarousel(); }, 50); }
                if (router.current === 'detail') { setTimeout(function() { initDetailAnimations(); }, 50); }
                observeExistingMedia();
            } else {
                waitForAnimationEnd(overlayExit, SEARCH_PAGE_EXIT_DURATION).then(function() {
                    injectSection(router.current, contentWithoutAnimation);
                    if (router.current === 'home') { initHomeAnimations(); initCarousel(); }
                    if (router.current === 'detail') { initDetailAnimations(); }
                    observeExistingMedia();
                });
            }

        } else if (isDetailTransition) {
            clearTransientContent();
            injectSection('detail', contentWithoutAnimation);

            let mainContainer = document.getElementById('main-container');
            if (mainContainer) {
                mainContainer.scrollTop = 0;
                mainContainer.dispatchEvent(new CustomEvent('detail:rendered'));
            }

            if (!getHeroTransition()) {
                initDetailAnimations();
            }

            return;

        } else if (animationClass && router.previous && _mode !== 'pop' && searchTransition.type !== 'search-exit-pop') {
            domOptimizer.cleanupContainer(container);

            const effectiveOldAnimationClass = oldAnimationClass || 'animate-fade-out';

            const fragment = document.createDocumentFragment();
            const template = document.createElement('template');
            template.innerHTML = `
                <div class="page-transition-container">
                    <div class="page-transition-old ${effectiveOldAnimationClass}">${oldContent}</div>
                    <div class="page-transition-new ${animationClass}">${contentWithoutAnimation}</div>
                </div>
            `.trim();
            fragment.appendChild(template.content);

            clearTransientContent();
            container.appendChild(fragment);

            const newPageEl = container.querySelector('.page-transition-new');
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (newPageEl && !prefersReducedMotion) {
                waitForAnimationEnd(newPageEl, 500).then(function() {
                    injectSection(router.current, contentWithoutAnimation);
                    if (router.current === 'home' && DB.announcement.show) {
                        setTimeout(showAnnouncement, 0);
                    }
                    if (router.current === 'profile') {
                        setTimeout(bindPasswordCheck, 10);
                    }
                    observeExistingMedia();
                    if (router.current === 'search') {
                        bindSearchControlsDelegated();
                    }
                    if (router.current === 'home') {
                        initHomeAnimations();
                        initCarousel();
                    }
                    if (router.current === 'detail') {
                        initDetailAnimations();
                    }
                });
            } else {
                injectSection(router.current, contentWithoutAnimation);
                if (router.current === 'home' && DB.announcement.show) {
                    setTimeout(showAnnouncement, 0);
                }
                if (router.current === 'profile') {
                    setTimeout(bindPasswordCheck, 10);
                }
                observeExistingMedia();
                if (router.current === 'search') {
                    bindSearchControlsDelegated();
                }
                if (router.current === 'home') {
                    setTimeout(function() { initHomeAnimations(); initCarousel(); }, 50);
                }
                if (router.current === 'detail') {
                    setTimeout(function() { initDetailAnimations(); }, 50);
                }
            }
        } else if (isProfileTransition || isSearchRefresh) {
            if (isSearchRefresh) {
                const searchContainer = container.querySelector('.space-y-5');
                if (searchContainer) {
                    if (stateMachine.state !== RenderState.IDLE) {
                        ensureStateMachineIdle();
                    }
                    performPartialRefresh(router.params, searchContainer);
                    return;
                }
            }

            searchOrchestrator.startAnimation();
            container.classList.add('animate-refresh-out');

            const executeSearchRefresh = async () => {
                try {
                    const result = await searchOrchestrator.executeSearch(router.params);

                    if (result.aborted) {
                        return;
                    }

                    if (result.fromCache) {
                        const resultsContainer = container.querySelector('.search-header');
                        if (resultsContainer) {
                            const parent = resultsContainer.parentElement;
                            if (parent) {
                                parent.innerHTML = renderSearchResults(router.params);
                            }
                        }
                        updateFilterButtons(
                            router.params.sort || '',
                            router.params.filter || '',
                            router.params.order || 'desc'
                        );
                        observeExistingMedia();
                        bindSearchControlsDelegated();
                        return;
                    }

                    injectSection(router.current, newContent);
                    container.classList.remove('animate-refresh-out');

                    void container.offsetWidth;
                    container.classList.add('animate-refresh-in');

                    setTimeout(() => {
                        container.classList.remove('animate-refresh-in');
                        searchOrchestrator.endAnimation();
                    }, 300);

                    if (router.current === 'profile') {
                        setTimeout(bindPasswordCheck, 10);
                    }
                    observeExistingMedia();
                    if (router.current === 'search') {
                        bindSearchControlsDelegated();
                    }
                } catch (error) {
                    console.error('Search refresh error:', error);
                    injectSection(router.current, newContent);
                    container.classList.remove('animate-refresh-out');
                    searchOrchestrator.endAnimation();
                    if (router.current === 'search') {
                        bindSearchControlsDelegated();
                    }
                }
            };

            setTimeout(executeSearchRefresh, 250);
        } else {
            domOptimizer.cleanupContainer(container);
            injectSection(router.current, newContent);
            if (router.current === 'home' && DB.announcement.show) {
                setTimeout(showAnnouncement, 0);
            }
            if (router.current === 'profile') {
                setTimeout(bindPasswordCheck, 10);
            }
            observeExistingMedia();
            if (router.current === 'search') {
                bindSearchControlsDelegated();
            }
            if (router.current === 'home') {
                setTimeout(() => {
                    initHomeAnimations();
                    initCarousel();
                }, 50);
            }
            if (router.current === 'detail') {
                setTimeout(() => {
                    initDetailAnimations();
                }, 50);
            }
        }
}

function bindSearchControls() {
    bindSearchControlsDelegated();
}

export function getRenderState() {
    return stateMachine.state;
}

export function isRenderIdle() {
    return stateMachine.state === RenderState.IDLE;
}

export function retryLastSearch() {
    if (errorHandler && stateMachine.isError) {
        errorHandler.retry();
    }
}

export function getTelemetryStats() {
    return telemetry.getStats();
}

export function getTelemetryPerformance() {
    return telemetry.getPerformanceMeasures();
}

export default { render, getRenderState, isRenderIdle, retryLastSearch, getTelemetryStats, getTelemetryPerformance };
