// App bootstrap: loader screen, progress bar, init sequence
// Utility functions for app bootstrap

function parseInitialRoute() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
        const match = hash.match(/^#\/?(\w+)(?:\?(.*))?$/);
        if (match) {
            const page = match[1];
            const params = {};
            if (match[2]) {
                const searchParams = new URLSearchParams(match[2]);
                searchParams.forEach((value, key) => { params[key] = value; });
            }
            return { page, params };
        }
    }
    return { page: "home", params: {} };
}

function initScrollToTop() {
    const btn = document.getElementById("scroll-to-top-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
        const main = document.getElementById("main-container");
        (main || window).scrollTo({ top: 0, behavior: "smooth" });
    });
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