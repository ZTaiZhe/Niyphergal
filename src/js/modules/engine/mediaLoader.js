import { throttle } from '../foundation/utils.js';

const LAZY_LOAD_CONFIG = {
    rootMargin: '300px 0px',
    threshold: 0.01,
    placeholderClass: 'img-placeholder',
    loadedClass: 'img-loaded',
    errorClass: 'img-error',
    fadeInDuration: 300
};

let imageObserver = null;
let videoObserver = null;
const loadedImages = new Set();
const loadedVideos = new Set();

export function initLazyLoad() {
    if ('IntersectionObserver' in window) {
        imageObserver = new IntersectionObserver(handleImageIntersection, {
            rootMargin: LAZY_LOAD_CONFIG.rootMargin,
            threshold: LAZY_LOAD_CONFIG.threshold
        });

        videoObserver = new IntersectionObserver(handleVideoIntersection, {
            rootMargin: LAZY_LOAD_CONFIG.rootMargin,
            threshold: LAZY_LOAD_CONFIG.threshold
        });
    }

    observeExistingMedia();

    window.addEventListener('scroll', throttle(cleanupObservers, 5000), { passive: true });
}

export function observeExistingMedia() {
    document.querySelectorAll('img[data-src]').forEach(img => {
        if (imageObserver) {
            imageObserver.observe(img);
        } else {
            loadImage(img);
        }
    });

    document.querySelectorAll('iframe[data-src], video[data-src]').forEach(media => {
        if (videoObserver) {
            videoObserver.observe(media);
        } else {
            loadVideo(media);
        }
    });
}

function handleImageIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadImage(entry.target);
            imageObserver.unobserve(entry.target);
        }
    });
}

function handleVideoIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadVideo(entry.target);
            videoObserver.unobserve(entry.target);
        }
    });
}

export function loadImage(img) {
    const src = img.dataset.src || img.src;
    if (!src) {return;}

    if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
    }

    if (img.complete && img.naturalWidth > 0) {
        img.classList.remove(LAZY_LOAD_CONFIG.placeholderClass);
        img.classList.add(LAZY_LOAD_CONFIG.loadedClass);
        img.style.opacity = '1';
        return;
    }

    img.classList.add(LAZY_LOAD_CONFIG.placeholderClass);

    img.onload = () => {
        img.classList.remove(LAZY_LOAD_CONFIG.placeholderClass);
        img.classList.add(LAZY_LOAD_CONFIG.loadedClass);
        img.style.opacity = '1';
        img.onload = null;
        img.onerror = null;
    };

    img.onerror = () => {
        img.classList.remove(LAZY_LOAD_CONFIG.placeholderClass);
        img.classList.add(LAZY_LOAD_CONFIG.errorClass);
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" fill="%23999" text-anchor="middle" dy=".3em"%3E加载失败%3C/text%3E%3C/svg%3E';
        img.onload = null;
        img.onerror = null;
    };
}

export function loadVideo(media) {
    if (loadedVideos.has(media)) {return;}

    const src = media.dataset.src;
    if (!src) {return;}

    if (media.tagName === 'IFRAME') {
        media.src = src;
        delete media.dataset.src;
    } else if (media.tagName === 'VIDEO') {
        media.src = src;
        media.load();
        delete media.dataset.src;
    }

    loadedVideos.add(media);
}

function cleanupObservers() {
    if (imageObserver) {
        document.querySelectorAll('img.img-loaded, img.img-error').forEach(img => {
            imageObserver.unobserve(img);
        });
    }

    if (videoObserver) {
        document.querySelectorAll('iframe[data-loaded="true"], video[data-loaded="true"]').forEach(video => {
            videoObserver.unobserve(video);
        });
    }
}

export function destroyLazyLoad() {
    if (imageObserver) {
        imageObserver.disconnect();
        imageObserver = null;
    }
    if (videoObserver) {
        videoObserver.disconnect();
        videoObserver = null;
    }
    loadedImages.clear();
    loadedVideos.clear();
}

export function renderImageWithPlaceholder(src, options = {}) {
    const {
        alt = '',
        className = '',
        width = '100%',
        height = 'auto',
        loading = 'lazy',
        objectFit = 'cover'
    } = options;

    const placeholderStyle = `
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    `;

    return `
        <img 
            data-src="${src}"
            alt="${alt}"
            class="${className}"
            style="width: ${width}; height: ${height}; object-fit: ${objectFit}; opacity: 0; transition: opacity 0.3s ease-out;"
            loading="${loading}"
            decoding="async"
        >
    `;
}

export function renderVideoWithPlaceholder(src, options = {}) {
    const {
        className = '',
        width = '100%',
        height = '100%',
        type = 'iframe'
    } = options;

    const placeholderStyle = `
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    `;

    if (type === 'iframe') {
        return `
            <div class="video-placeholder ${className}" style="width: ${width}; height: ${height}; ${placeholderStyle}">
                <iframe 
                    data-src="${src}"
                    class="w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy"
                ></iframe>
            </div>
        `;
    }

    return `
        <video 
            data-src="${src}"
            class="${className}"
            style="width: ${width}; height: ${height};"
            controls
            preload="metadata"
        ></video>
    `;
}

export function getLoadedCount() {
    return {
        images: loadedImages.size,
        videos: loadedVideos.size
    };
}

export default {
    initLazyLoad,
    observeExistingMedia,
    loadImage,
    loadVideo,
    destroyLazyLoad,
    renderImageWithPlaceholder,
    renderVideoWithPlaceholder,
    getLoadedCount
};
