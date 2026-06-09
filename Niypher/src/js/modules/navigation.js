import { DB } from './data.js';
import { refreshCards } from '../pages/home.js';

let homeNavHandler = null;
let currentRouter = null;

function morphLogoToBack() {
    var btn = document.getElementById('header-logo-btn');
    if (!btn) { document.body.classList.add('is-detail-page'); return; }

    // Measure current pill-state width so CSS can transition it
    var r0 = btn.getBoundingClientRect();
    btn.style.width = r0.width + 'px';
    btn.style.height = r0.height + 'px';
    void btn.offsetHeight;

    // CSS transitions handle everything: size, padding, border-radius, children opacity
    document.body.classList.add('is-detail-page');
}

function morphBackToLogo() {
    var btn = document.getElementById('header-logo-btn');
    if (!btn) { document.body.classList.remove('is-detail-page'); return; }

    // Temporarily disable transitions to measure target pill dimensions accurately
    btn.style.transition = 'none';
    document.body.classList.remove('is-detail-page');
    void btn.offsetHeight;
    var r1 = btn.getBoundingClientRect();
    var r1CS = window.getComputedStyle(btn);
    // Re-add detail class while transitions are still disabled (snap, don't animate)
    document.body.classList.add('is-detail-page');

    // Set explicit circle size as transition starting point
    btn.style.width = '40px';
    btn.style.height = '40px';
    btn.style.borderRadius = '9999px';
    void btn.offsetHeight;

    // Now re-enable transitions for the circle → pill morph
    btn.style.transition = '';

    // Remove class and set target pill dimensions for CSS to transition to
    document.body.classList.remove('is-detail-page');
    btn.style.width = r1.width + 'px';
    btn.style.height = r1.height + 'px';
    btn.style.borderRadius = r1CS.borderRadius;

    // Clean up explicit dimensions after transition
    setTimeout(function() {
        btn.style.width = '';
        btn.style.height = '';
        btn.style.borderRadius = '';
    }, 420);
}
export function updateNav(routerInstance) {
    const current = routerInstance ? routerInstance.current : 'home';
    var shouldBeDetail = current === 'detail';
    var isDetailNow = document.body.classList.contains('is-detail-page');
    if (shouldBeDetail !== isDetailNow) {
        if (!shouldBeDetail) {
            morphBackToLogo();
        } else {
            morphLogoToBack();
        }
    }
    currentRouter = routerInstance;
    const searchRefreshBtn = document.getElementById('search-refresh-btn');
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

    if (searchRefreshBtn) {
        if (current === 'search') {
            searchRefreshBtn.classList.remove('hidden');
            searchRefreshBtn.onclick = async () => {
                const icon = searchRefreshBtn.querySelector('i');
                if (icon) {
                    icon.style.transition = 'transform 0.3s ease';
                    icon.style.transform = 'rotate(360deg)';
                }
                const params = routerInstance.params || {};
                routerInstance.replace('search', params);
                setTimeout(() => {
                    if (icon) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                }, 300);
            };
        } else {
            searchRefreshBtn.classList.add('hidden');
        }
    }

    if (scrollToTopBtn) {
        if (current === 'search') {
            scrollToTopBtn.style.bottom = 'calc(max(env(safe-area-inset-bottom, 20px), 5rem) + 60px)';
        } else {
            scrollToTopBtn.style.bottom = '5rem';
        }
    }

    document.querySelectorAll('.nav-item').forEach(el => {
        const target = el.getAttribute('data-target');
        const span = el.querySelector('.text-\\[10px\\]');
        const wrapper = el.querySelector('.nav-icon-wrapper');
        const lineEl = wrapper.querySelector('.nav-icon-line');
        const fillEl = wrapper.querySelector('.nav-icon-fill');

        if (target === 'home') {
            const homeBtn = el;
            const homeSpan = span;

            if (homeNavHandler) {
                homeBtn.removeEventListener('click', homeNavHandler);
            }

            if (current === 'home') {
                lineEl.className = 'ri-refresh-line text-2xl mb-1 nav-icon-line transition-transform';
                fillEl.className = 'ri-refresh-line text-2xl mb-1 nav-icon-fill transition-transform';
                lineEl.style.display = '';
                fillEl.style.display = 'none';
                if (homeSpan) {homeSpan.textContent = '刷新';}
                homeBtn.classList.add('active');
                homeBtn.setAttribute('aria-current', 'page');

                homeNavHandler = async (e) => {
                    e.preventDefault();
                    if (lineEl) {
                        lineEl.style.transition = 'transform 0.3s ease';
                        lineEl.style.transform = 'rotate(360deg)';
                    }
                    await refreshCards();
                    setTimeout(() => {
                        if (lineEl) {
                            lineEl.style.transform = 'rotate(0deg)';
                        }
                    }, 300);
                };
            } else {
                lineEl.className = 'ri-home-4-line text-2xl mb-1 nav-icon-line transition-transform';
                fillEl.className = 'ri-home-4-fill text-2xl mb-1 nav-icon-fill transition-transform';
                lineEl.style.display = '';
                fillEl.style.display = 'none';
                if (homeSpan) {homeSpan.textContent = '推荐';}
                homeBtn.classList.remove('active');
                homeBtn.removeAttribute('aria-current');

                homeNavHandler = (e) => {
                    e.preventDefault();
                    routerInstance.push('home');
                };
            }

            homeBtn.addEventListener('click', homeNavHandler);
        } else {
            if (target === current) {
                el.classList.add('active');
                el.setAttribute('aria-current', 'page');
                lineEl.style.display = 'none';
                fillEl.style.display = '';
            } else {
                el.classList.remove('active');
                el.removeAttribute('aria-current');
                lineEl.style.display = '';
                fillEl.style.display = 'none';
            }

            if (target === 'profile') {
                if (span) {
                    span.textContent = DB.user ? '我的' : '注册/登录';
                }
            }
        }
    });
}

export default { updateNav };