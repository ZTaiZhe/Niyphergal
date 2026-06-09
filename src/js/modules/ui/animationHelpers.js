import { revealDetailContent, setHeroTransition } from '../../pages/detail.js';

export function waitForAnimationEnd(el, fallbackMs) {
    if (fallbackMs === undefined) { fallbackMs = 350; }
    return new Promise(function(resolve) {
        var resolved = false;
        function done() {
            if (resolved) { return; }
            resolved = true;
            el.removeEventListener('animationend', onEnd);
            el.removeEventListener('transitionend', onEnd);
            resolve();
        }
        function onEnd(e) {
            if (e.target === el) { done(); }
        }
        el.addEventListener('animationend', onEnd);
        el.addEventListener('transitionend', onEnd);
        setTimeout(function() {
            if (!resolved) { done(); }
        }, fallbackMs + 100);
    });
}

export function waitForAllAnimations(elements, fallbackMsPerElement) {
    return Promise.all(Array.from(elements).map(function(el) {
        return waitForAnimationEnd(el, fallbackMsPerElement || 50);
    }));
}

var _heroInFlight = false;
var _heroExitInFlight = false;
// Use window to avoid circular-dependency module-scope issues
// (animationHelpers ↔ detail.js circular import can cause separate bindings)
var _heroExitContextKey = '__niypher_heroExitContext';

var SPRING_EASING = 'linear(0, 0.006 2.9%, 0.059 9.7%, 0.202 18.8%, 0.504 33.6%, 0.748 49.8%, 0.873 60.9%, 0.944 72.4%, 0.98 84.3%, 0.997 95.7%, 1)';

function buildArcKeyframes(fromRect, toRect, toBorderRadius, fromBorderRadius, useArc) {
    if (!useArc) {
        return [
            { left: fromRect.left + 'px', top: fromRect.top + 'px', width: fromRect.width + 'px', height: fromRect.height + 'px', borderRadius: fromBorderRadius },
            { left: toRect.left + 'px', top: toRect.top + 'px', width: toRect.width + 'px', height: toRect.height + 'px', borderRadius: toBorderRadius }
        ];
    }
    var dx = toRect.left - fromRect.left;
    var dy = toRect.top - fromRect.top;
    var arcHeight = Math.min(80, Math.max(32, Math.abs(dy) * 0.3));
    var dw = toRect.width - fromRect.width;
    var dh = toRect.height - fromRect.height;
    var midX = fromRect.left + dx * 0.45;
    var midY = fromRect.top + dy * 0.45 - arcHeight;
    var midW = fromRect.width + dw * 0.45;
    var midH = fromRect.height + dh * 0.45;
    return [
        { left: fromRect.left + 'px', top: fromRect.top + 'px', width: fromRect.width + 'px', height: fromRect.height + 'px', borderRadius: fromBorderRadius, offset: 0 },
        { left: midX + 'px', top: midY + 'px', width: midW + 'px', height: midH + 'px', borderRadius: fromBorderRadius, offset: 0.45 },
        { left: toRect.left + 'px', top: toRect.top + 'px', width: toRect.width + 'px', height: toRect.height + 'px', borderRadius: toBorderRadius, offset: 1 }
    ];
}

function buildTitleKeyframes(fromS, toS, useArc) {
    // fromS/toS: { left, top, fontSize, fontWeight, letterSpacing, color, textShadow }
    if (!useArc) {
        return [
            { left: fromS.left + 'px', top: fromS.top + 'px', fontSize: fromS.fontSize, fontWeight: fromS.fontWeight, letterSpacing: fromS.letterSpacing, color: fromS.color, textShadow: fromS.textShadow, opacity: 1 },
            { left: toS.left + 'px', top: toS.top + 'px', fontSize: toS.fontSize, fontWeight: toS.fontWeight, letterSpacing: toS.letterSpacing, color: toS.color, textShadow: toS.textShadow, opacity: 1 }
        ];
    }
    var dx = toS.left - fromS.left;
    var dy = toS.top - fromS.top;
    var arcH = Math.min(60, Math.max(20, Math.abs(dy) * 0.25));
    return [
        { left: fromS.left + 'px', top: fromS.top + 'px', fontSize: fromS.fontSize, fontWeight: fromS.fontWeight, letterSpacing: fromS.letterSpacing, color: fromS.color, textShadow: fromS.textShadow, opacity: 1, offset: 0 },
        { left: (fromS.left + dx * 0.45) + 'px', top: (fromS.top + dy * 0.45 - arcH) + 'px', fontSize: fromS.fontSize, fontWeight: fromS.fontWeight, letterSpacing: fromS.letterSpacing, color: fromS.color, textShadow: fromS.textShadow, opacity: 1, offset: 0.45 },
        { left: toS.left + 'px', top: toS.top + 'px', fontSize: toS.fontSize, fontWeight: toS.fontWeight, letterSpacing: toS.letterSpacing, color: toS.color, textShadow: toS.textShadow, opacity: 0.85, offset: 1 }
    ];
}

function captureTitleStyle(el) {
    var cs = window.getComputedStyle(el);
    return {
        rect: el.getBoundingClientRect(),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        letterSpacing: cs.letterSpacing,
        fontFamily: cs.fontFamily,
        color: cs.color,
        textShadow: cs.textShadow
    };
}

export function performHeroNavigate(sourceImg, targetId, routerInstance) {
    if (_heroInFlight) return;
    _heroInFlight = true;

    var fromRect = sourceImg.getBoundingClientRect();
    var fromSrc = sourceImg.currentSrc || sourceImg.src;
    if (fromSrc.indexOf('data:') === 0) {
        fromSrc = sourceImg.getAttribute('data-src') || fromSrc;
    }
    var fromStyle = window.getComputedStyle(sourceImg);
    var sourceCard = sourceImg.closest('[data-action="navigate-detail"]') || sourceImg.parentElement;
    var fromBorderRadius = sourceCard ? window.getComputedStyle(sourceCard).borderRadius : fromStyle.borderRadius;

    var sourceTitleEl = sourceCard ? sourceCard.querySelector('h3') : null;
    var titleClone = null;
    var fromTitleStyle = null;

    if (sourceTitleEl) {
        fromTitleStyle = captureTitleStyle(sourceTitleEl);
        titleClone = document.createElement('div');
        titleClone.className = 'hero-clone-title';
        titleClone.textContent = sourceTitleEl.textContent.trim();
        titleClone.style.cssText =
            'left:' + fromTitleStyle.rect.left + 'px;' +
            'top:' + fromTitleStyle.rect.top + 'px;' +
            'font-size:' + fromTitleStyle.fontSize + ';' +
            'font-weight:' + fromTitleStyle.fontWeight + ';' +
            'letter-spacing:' + fromTitleStyle.letterSpacing + ';' +
            'font-family:' + fromTitleStyle.fontFamily + ';' +
            'color:' + fromTitleStyle.color + ';' +
            'text-shadow:' + fromTitleStyle.textShadow + ';' +
            'max-width:' + fromTitleStyle.rect.width + 'px;';
        document.body.appendChild(titleClone);
    }

    var frame = document.createElement('div');
    frame.className = 'hero-clone';
    frame.style.setProperty('left', fromRect.left + 'px');
    frame.style.setProperty('top', fromRect.top + 'px');
    frame.style.setProperty('width', fromRect.width + 'px');
    frame.style.setProperty('height', fromRect.height + 'px');
    frame.style.setProperty('border-radius', fromBorderRadius);

    var contentImg = document.createElement('img');
    contentImg.className = 'hero-clone-content';
    contentImg.src = fromSrc;
    contentImg.draggable = false;
    frame.appendChild(contentImg);
    document.body.appendChild(frame);

    var container = document.getElementById('main-container');
    if (container) {
        window[_heroExitContextKey] = {
            gameId: targetId,
            sourcePage: routerInstance.current,
            sourceRect: { left: fromRect.left, top: fromRect.top, width: fromRect.width, height: fromRect.height },
            sourceBorderRadius: fromBorderRadius,
            titleStyle: fromTitleStyle ? {
                rect: { left: fromTitleStyle.rect.left, top: fromTitleStyle.rect.top, width: fromTitleStyle.rect.width, height: fromTitleStyle.rect.height },
                fontSize: fromTitleStyle.fontSize,
                fontWeight: fromTitleStyle.fontWeight,
                letterSpacing: fromTitleStyle.letterSpacing,
                color: fromTitleStyle.color,
                textShadow: fromTitleStyle.textShadow
            } : null
        };
        container.addEventListener('detail:rendered', onRendered, { once: true });
    }

    routerInstance.push('detail', { id: targetId });

    var clonesToClean = [];
    clonesToClean.push(frame);
    if (titleClone) clonesToClean.push(titleClone);

    var fallback;
    function cleanup() {
        clearTimeout(fallback);
        revealDetailContent();
        for (var i = 0; i < clonesToClean.length; i++) {
            var el = clonesToClean[i];
            if (el && el.parentNode) el.parentNode.removeChild(el);
        }
        _heroInFlight = false;
        setHeroTransition(false);
    }
    fallback = setTimeout(function() { cleanup(); }, 800);

    function onRendered() {
        clearTimeout(fallback);
        var targetImg = document.querySelector('[data-hero-role="target"]');
        if (!targetImg) { cleanup(); return; }

        var l0 = targetImg.closest('.detail-stagger-layer');
        if (l0) { l0.style.transition = 'none'; l0.classList.add('is-visible'); void l0.offsetHeight; }

        var toRect = targetImg.getBoundingClientRect();
        var toStyle = window.getComputedStyle(targetImg);
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var fk = buildArcKeyframes(fromRect, toRect, toStyle.borderRadius, fromBorderRadius, !reducedMotion);
        var fa = frame.animate(fk, { duration: reducedMotion ? 200 : 380, easing: reducedMotion ? 'ease-out' : SPRING_EASING, fill: 'forwards' });

        var ta = null;
        if (titleClone && fromTitleStyle) {
            var targetTitleEl = document.querySelector('.detail-stagger-layer h1');
            if (targetTitleEl) {
                var toTitleStyle = captureTitleStyle(targetTitleEl);
                var tk = buildTitleKeyframes(
                    { left: fromTitleStyle.rect.left, top: fromTitleStyle.rect.top, fontSize: fromTitleStyle.fontSize, fontWeight: fromTitleStyle.fontWeight, letterSpacing: fromTitleStyle.letterSpacing, color: fromTitleStyle.color, textShadow: fromTitleStyle.textShadow },
                    { left: toTitleStyle.rect.left, top: toTitleStyle.rect.top, fontSize: toTitleStyle.fontSize, fontWeight: toTitleStyle.fontWeight, letterSpacing: toTitleStyle.letterSpacing, color: toTitleStyle.color, textShadow: toTitleStyle.textShadow || 'none' },
                    !reducedMotion
                );
                ta = titleClone.animate(tk, { duration: reducedMotion ? 200 : 380, easing: reducedMotion ? 'ease-out' : SPRING_EASING, fill: 'forwards' });
            }
        }

        var done = 0, total = ta ? 2 : 1;
        function mark() { done++; if (done >= total) cleanup(); }
        fa.onfinish = mark;
        if (ta) ta.onfinish = mark;

        var gf = setTimeout(function() { mark(); mark(); }, 900);
        var orig = cleanup;
        cleanup = function() { clearTimeout(gf); orig(); };
    }
}

export function getHeroExitContext() { return window[_heroExitContextKey]; }
export function clearHeroExitContext() {
    window[_heroExitContextKey] = null;
}
export function isHeroExitInFlight() { return _heroExitInFlight; }

export function performHeroExit(routerInstance) {
    var _ctx = window[_heroExitContextKey];
    if (_heroExitInFlight || _heroInFlight || !_ctx) return;
    _heroExitInFlight = true;

    var targetImg = document.querySelector('[data-hero-role="target"]');
    if (!targetImg) {
        _heroExitInFlight = false;
        routerInstance.push(_ctx.sourcePage);
        window[_heroExitContextKey] = null;
        return;
    }

    var fromRect = targetImg.getBoundingClientRect();
    var fromSrc = targetImg.currentSrc || targetImg.src;
    var fromBR = window.getComputedStyle(targetImg).borderRadius;
    var toRect = _ctx.sourceRect;
    var toBR = _ctx.sourceBorderRadius;

    var titleClone = null;
    var fromTitleStyle = null;
    var sourceTitleStyle = _ctx.titleStyle;

    if (sourceTitleStyle) {
        var targetTitleEl = document.querySelector('.detail-stagger-layer h1');
        if (targetTitleEl) {
            fromTitleStyle = captureTitleStyle(targetTitleEl);
            titleClone = document.createElement('div');
            titleClone.className = 'hero-clone-title';
            titleClone.textContent = targetTitleEl.textContent.trim();
            titleClone.style.cssText =
                'left:' + fromTitleStyle.rect.left + 'px;' +
                'top:' + fromTitleStyle.rect.top + 'px;' +
                'font-size:' + fromTitleStyle.fontSize + ';' +
                'font-weight:' + fromTitleStyle.fontWeight + ';' +
                'letter-spacing:' + fromTitleStyle.letterSpacing + ';' +
                'font-family:' + fromTitleStyle.fontFamily + ';' +
                'color:' + fromTitleStyle.color + ';' +
                'text-shadow:' + (fromTitleStyle.textShadow || 'none') + ';' +
                'max-width:' + fromTitleStyle.rect.width + 'px;';
            document.body.appendChild(titleClone);
        }
    }

    var frame = document.createElement('div');
    frame.className = 'hero-clone';
    frame.style.setProperty('left', fromRect.left + 'px');
    frame.style.setProperty('top', fromRect.top + 'px');
    frame.style.setProperty('width', fromRect.width + 'px');
    frame.style.setProperty('height', fromRect.height + 'px');
    frame.style.setProperty('border-radius', fromBR);

    var contentImg = document.createElement('img');
    contentImg.className = 'hero-clone-content';
    contentImg.src = fromSrc;
    contentImg.draggable = false;
    frame.appendChild(contentImg);
    document.body.appendChild(frame);

    function startAnimation() {
        var _ctx2 = window[_heroExitContextKey];
        routerInstance.push(_ctx2 ? _ctx2.sourcePage : 'home', {});

        var clonesToClean = [];
        clonesToClean.push(frame);
        if (titleClone) clonesToClean.push(titleClone);

        var fallback;
        function cleanup() {
            clearTimeout(fallback);
            setHeroTransition(false);
            for (var i = 0; i < clonesToClean.length; i++) {
                var el = clonesToClean[i];
                if (el && el.parentNode) el.parentNode.removeChild(el);
            }
            var exitGameId = window[_heroExitContextKey] ? window[_heroExitContextKey].gameId : null;
            _heroExitInFlight = false;
            window[_heroExitContextKey] = null;
            document.dispatchEvent(new CustomEvent('hero:exit-complete', { detail: { gameId: exitGameId } }));
        }
        fallback = setTimeout(function() { cleanup(); }, 800);

        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var fk = buildArcKeyframes(fromRect, toRect, toBR, fromBR, !reducedMotion);
        var fa = frame.animate(fk, { duration: reducedMotion ? 200 : 380, easing: reducedMotion ? 'ease-out' : SPRING_EASING, fill: 'forwards' });

        var ta = null;
        if (titleClone && fromTitleStyle && sourceTitleStyle) {
            var tk = buildTitleKeyframes(
                { left: fromTitleStyle.rect.left, top: fromTitleStyle.rect.top, fontSize: fromTitleStyle.fontSize, fontWeight: fromTitleStyle.fontWeight, letterSpacing: fromTitleStyle.letterSpacing, color: fromTitleStyle.color, textShadow: fromTitleStyle.textShadow || 'none' },
                { left: sourceTitleStyle.rect.left, top: sourceTitleStyle.rect.top, fontSize: sourceTitleStyle.fontSize, fontWeight: sourceTitleStyle.fontWeight, letterSpacing: sourceTitleStyle.letterSpacing, color: sourceTitleStyle.color, textShadow: sourceTitleStyle.textShadow },
                !reducedMotion
            );
            ta = titleClone.animate(tk, { duration: reducedMotion ? 200 : 380, easing: reducedMotion ? 'ease-out' : SPRING_EASING, fill: 'forwards' });
        }

        var done = 0, total = ta ? 2 : 1;
        function mark() { done++; if (done >= total) cleanup(); }
        fa.onfinish = mark;
        if (ta) ta.onfinish = mark;

        var gf = setTimeout(function() { mark(); mark(); }, 900);
        var orig = cleanup;
        cleanup = function() { clearTimeout(gf); orig(); };
    }

    if (contentImg.complete && contentImg.naturalHeight !== 0) {
        startAnimation();
    } else {
        var imgReady = false;
        var imgTimeout = setTimeout(function() {
            if (!imgReady) { imgReady = true; startAnimation(); }
        }, 300);
        contentImg.onload = function() {
            if (!imgReady) { imgReady = true; clearTimeout(imgTimeout); startAnimation(); }
        };
    }
}