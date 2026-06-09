import { router } from '../foundation/router.js';

var _currentIndex = 0;
var _isPaused = false;
var _timer = null;
var _slides = [];
var _isAnimating = false;
var _direction = 1;

export function renderCarousel(slides) {
    if (!slides || slides.length === 0) return '';
    _slides = slides;
    var slidesHtml = '';
    for (var i = 0; i < slides.length; i++) {
        var s = slides[i];
        var clickAttr = s.action ? ' data-carousel-action="' + i + '"' : '';
        var cursorClass = s.action ? ' carousel-slide-clickable' : '';
        var activeClass = i === 0 ? ' carousel-slide-active' : '';
        var ctaHtml = '';
        if (s.type === 'game' && s.action) {
            ctaHtml = '<div class="carousel-cta-row">' +
                '<button class="carousel-cta-primary">查看详情</button>' +
                '<button class="carousel-cta-secondary">了解更多</button>' +
                '</div>';
        } else if (s.action) {
            ctaHtml = '<div class="carousel-cta-row">' +
                '<button class="carousel-cta-primary">立即查看</button>' +
                '</div>';
        }
        slidesHtml += '<div class="carousel-slide' + cursorClass + activeClass + '" data-slide-index="' + i + '"' + clickAttr + '>' +
            '<div class="carousel-kenburns" data-kenburns="' + i + '">' +
                '<div class="carousel-bg-image" style="background-image:url(\'' + s.image + '\')"></div>' +
                '<div class="carousel-bg-gradient"></div>' +
            '</div>' +
            '<div class="carousel-diagonal" data-diagonal="' + i + '"></div>' +
            '<div class="carousel-content">' +
                '<div class="carousel-content-inner">' +
                    '<div class="carousel-subtitle-row">' +
                        '<div class="carousel-accent-line" data-accent="' + i + '"></div>' +
                        '<p class="carousel-subtitle" data-subtitle="' + i + '">' + s.subtitle + '</p>' +
                    '</div>' +
                    '<h2 class="carousel-title" data-title="' + i + '">' + s.title + '</h2>' +
                    '<p class="carousel-desc" data-desc="' + i + '">' + s.description + '</p>' +
                    ctaHtml +
                '</div>' +
            '</div>' +
        '</div>';
    }
    var dotsHtml = '';
    for (var j = 0; j < slides.length; j++) {
        dotsHtml += '<button class="carousel-dot' + (j === 0 ? ' carousel-dot-active' : '') + '" data-dot-index="' + j + '"></button>';
    }
    return '<div class="carousel-container" data-carousel>' +
        slidesHtml +
        '<div class="carousel-gradient-mask">' +
            '<div class="carousel-gradient-mask-blur"></div>' +
            '<div class="carousel-gradient-mask-layers"></div>' +
            '<div class="carousel-gradient-mask-frost"></div>' +
        '</div>' +
        '<button class="carousel-arrow carousel-arrow-left" data-carousel-prev>&#8249;</button>' +
        '<button class="carousel-arrow carousel-arrow-right" data-carousel-next>&#8250;</button>' +
        '<div class="carousel-indicators">' + dotsHtml + '</div>' +
    '</div>';
}

export function initCarousel() {
    var container = document.querySelector('[data-carousel]');
    if (!container || _slides.length === 0) return;
    _currentIndex = 0;
    _isPaused = false;
    _isAnimating = false;
    _direction = 1;
    _startAutoPlay();
    container.addEventListener('mouseenter', function() { _isPaused = true; });
    container.addEventListener('mouseleave', function() { _isPaused = false; });
    var prevBtn = container.querySelector('[data-carousel-prev]');
    var nextBtn = container.querySelector('[data-carousel-next]');
    if (prevBtn) prevBtn.addEventListener('click', function(e) { e.stopPropagation(); _goPrev(); });
    if (nextBtn) nextBtn.addEventListener('click', function(e) { e.stopPropagation(); _goNext(); });
    var dots = container.querySelectorAll('[data-dot-index]');
    for (var i = 0; i < dots.length; i++) {
        dots[i].addEventListener('click', function(e) {
            e.stopPropagation();
            var idx = parseInt(this.getAttribute('data-dot-index'), 10);
            _goToSlide(idx);
        });
    }
    var clickables = container.querySelectorAll('[data-carousel-action]');
    for (var j = 0; j < clickables.length; j++) {
        clickables[j].addEventListener('click', function() {
            var idx = parseInt(this.getAttribute('data-carousel-action'), 10);
            var slide = _slides[idx];
            if (slide && slide.action) {
                if (slide.action.type === 'navigate') {
                    router.push(slide.action.page, slide.action.params || {});
                } else if (slide.action.type === 'link') {
                    window.open(slide.action.url, '_blank');
                }
            }
        });
    }
    _animateContentIn(container, 0, 1);
}

function _startAutoPlay() {
    if (_timer) clearInterval(_timer);
    _timer = setInterval(function() {
        if (!_isPaused && !_isAnimating) {
            _goNext();
        }
    }, 6000);
}

function _goNext() {
    _direction = 1;
    _goToSlide((_currentIndex + 1) % _slides.length);
}

function _goPrev() {
    _direction = -1;
    _goToSlide((_currentIndex - 1 + _slides.length) % _slides.length);
}

function _goToSlide(nextIndex) {
    if (_isAnimating) return;
    if (nextIndex === _currentIndex) return;
    _isAnimating = true;
    var container = document.querySelector('[data-carousel]');
    if (!container) { _isAnimating = false; return; }
    var slideEls = container.querySelectorAll('.carousel-slide');
    var currentEl = slideEls[_currentIndex];
    var nextEl = slideEls[nextIndex];
    if (!currentEl || !nextEl) { _isAnimating = false; return; }
    var dir = _direction;
    var ease = [0.25, 0.1, 0.25, 1];
    nextEl.style.transform = 'translateX(' + (dir * 100) + '%)';
    nextEl.style.opacity = '0';
    nextEl.classList.add('carousel-slide-active');
    var exitAnim = currentEl.animate([
        { opacity: 1, transform: 'translateX(0)' },
        { opacity: 0, transform: 'translateX(' + (-dir * 100) + '%)' }
    ], { duration: 800, easing: 'cubic-bezier(' + ease.join(',') + ')', fill: 'forwards' });
    var enterAnim = nextEl.animate([
        { opacity: 0, transform: 'translateX(' + (dir * 100) + '%)' },
        { opacity: 1, transform: 'translateX(0)' }
    ], { duration: 800, easing: 'cubic-bezier(' + ease.join(',') + ')', fill: 'forwards' });
    _animateKenBurns(container, nextIndex, dir);
    _animateDiagonal(container, nextIndex, dir);
    _animateContentIn(container, nextIndex, dir);
    exitAnim.onfinish = function() {
        currentEl.classList.remove('carousel-slide-active');
        currentEl.style.transform = '';
        currentEl.style.opacity = '';
        exitAnim.cancel();
        enterAnim.cancel();
        nextEl.style.transform = '';
        nextEl.style.opacity = '';
        _currentIndex = nextIndex;
        _isAnimating = false;
        _updateDots(container);
    };
    _updateDots(container);
}

function _animateKenBurns(container, index, dir) {
    var kb = container.querySelector('[data-kenburns="' + index + '"]');
    if (!kb) return;
    kb.animate([
        { transform: 'scale(1.08) translateX(' + (dir * 50) + 'px)' },
        { transform: 'scale(1) translateX(0)' }
    ], { duration: 10000, easing: 'ease-out', fill: 'none' });
}

function _animateDiagonal(container, index, dir) {
    var diag = container.querySelector('[data-diagonal="' + index + '"]');
    if (!diag) return;
    diag.animate([
        { transform: 'translateX(' + (dir > 0 ? '100%' : '-100%') + ')', opacity: 0 },
        { transform: 'translateX(0)', opacity: 0.08 }
    ], { duration: 1200, easing: 'cubic-bezier(0.25,0.1,0.25,1)', delay: 100, fill: 'forwards' });
}

function _animateContentIn(container, index, dir) {
    var ease = [0.25, 0.1, 0.25, 1];
    var easing = 'cubic-bezier(' + ease.join(',') + ')';
    var accent = container.querySelector('[data-accent="' + index + '"]');
    if (accent) {
        accent.animate([{ width: '0' }, { width: '40px' }], { duration: 600, easing: easing, delay: 300, fill: 'forwards' });
    }
    var subtitle = container.querySelector('[data-subtitle="' + index + '"]');
    if (subtitle) {
        subtitle.animate([
            { opacity: 0, transform: 'translateX(-20px)' },
            { opacity: 1, transform: 'translateX(0)' }
        ], { duration: 600, easing: easing, delay: 350, fill: 'forwards' });
    }
    var title = container.querySelector('[data-title="' + index + '"]');
    if (title) {
        title.animate([
            { opacity: 0, transform: 'translateY(40px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 700, easing: easing, delay: 150, fill: 'forwards' });
    }
    var desc = container.querySelector('[data-desc="' + index + '"]');
    if (desc) {
        desc.animate([
            { opacity: 0, transform: 'translateY(30px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 600, easing: easing, delay: 250, fill: 'forwards' });
    }
    var ctaRow = container.querySelectorAll('.carousel-slide[data-slide-index="' + index + '"] .carousel-cta-row');
    for (var i = 0; i < ctaRow.length; i++) {
        ctaRow[i].animate([
            { opacity: 0, transform: 'translateY(30px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 600, easing: easing, delay: 350, fill: 'forwards' });
    }
}

function _updateDots(container) {
    var dots = container.querySelectorAll('.carousel-dot');
    for (var i = 0; i < dots.length; i++) {
        if (i === _currentIndex) {
            dots[i].classList.add('carousel-dot-active');
        } else {
            dots[i].classList.remove('carousel-dot-active');
        }
    }
}
