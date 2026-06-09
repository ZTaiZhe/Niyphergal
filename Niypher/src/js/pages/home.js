import { renderCarousel } from '../modules/carousel.js';
import { DB } from '../modules/data.js';
import { escapeHtml } from '../modules/utils.js';
import { renderGameCard, renderModal } from '../modules/components.js';
import { observeExistingMedia } from '../modules/mediaLoader.js';
import { renderCardSkeleton } from '../modules/components.js';
import edgeRecommender from '../modules/recommendation.js';

let isRefreshing = false;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function initHomeAnimations() {
    const cards = document.querySelectorAll('.game-cards-container .glass-card');
    cards.forEach((card, index) => {
        card.style.setProperty('--stagger-index', index);
        card.classList.add('is-hidden');
    });

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            cards.forEach(card => {
                card.classList.remove('is-hidden');
                card.classList.add('is-loaded');
            });
        });
    });
}

export function revealHomeCardsImmediately(excludeGameId) {
    var cards = document.querySelectorAll('.game-cards-container .glass-card');
    for (var i = 0; i < cards.length; i++) {
        cards[i].style.setProperty('--stagger-index', i);
        if (excludeGameId != null && cards[i].dataset.id === String(excludeGameId)) {
            cards[i].classList.remove('is-hidden');
            cards[i].style.opacity = '0';
        } else {
            cards[i].style.transition = 'none';
            cards[i].classList.remove('is-hidden');
            cards[i].classList.add('is-loaded');
            void cards[i].offsetHeight;
            cards[i].style.transition = '';
        }
    }
}

export function revealFlownCard(gameId) {
    var card = document.querySelector('.game-cards-container .glass-card[data-id="' + gameId + '"]');
    if (card) {
        card.style.opacity = '';
        card.classList.add('is-loaded');
    }
}

export async function refreshCards() {
    if (isRefreshing) return;
    isRefreshing = true;

    const container = document.querySelector('.game-cards-container');
    if (!container) { isRefreshing = false; return; }

    const currentCards = [...container.querySelectorAll('.glass-card')];
    const firstRects = currentCards.map(c => c.getBoundingClientRect());

    const scoreMap = edgeRecommender.scoreAllGames(DB.resources);
    let hasProfile = false;
    for (const [, s] of scoreMap) { if (s > 0) { hasProfile = true; break; } }
    const shuffledResources = hasProfile
        ? [...DB.resources].sort((a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0))
        : [...DB.resources].sort(() => Math.random() - 0.5);

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    shuffledResources.forEach((res, index) => {
        const cardHtml = renderGameCard(res);
        const template = document.createElement('template');
        template.innerHTML = cardHtml.trim();
        const card = template.content.firstChild;
        if (card) {
            card.classList.add('flip-card');
            card.style.setProperty('--stagger-index', index);
            // Preload cover image from cache to prevent placeholder flash
            const img = card.querySelector('img[data-src]');
            if (img && img.dataset.src) {
                img.src = img.dataset.src;
                delete img.dataset.src;
            }
            fragment.appendChild(card);
        }
    });

    container.appendChild(fragment);
    observeExistingMedia();

    const newCards = [...container.querySelectorAll('.glass-card')];
    const lastRects = newCards.map(c => c.getBoundingClientRect());

    const invertMap = [];
    for (let i = 0; i < firstRects.length && i < newCards.length; i++) {
        const dx = firstRects[i].left - lastRects[i].left;
        const dy = firstRects[i].top - lastRects[i].top;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            invertMap.push({ card: newCards[i], dx, dy });
        }
    }

    invertMap.forEach(({ card, dx, dy }) => {
        card.style.transition = 'none';
        card.style.transform = `translate(${dx}px, ${dy}px)`;
        card.style.willChange = 'transform';
    });

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            invertMap.forEach(({ card }) => {
                card.style.transition = 'transform 0.4s linear';
                card.style.transform = '';
            });
        });
    });

    let pending = invertMap.length;
    const finish = () => {
        newCards.forEach(c => {
            const tc = c.querySelector('.card-text-container');
            if (tc) {
                tc.style.opacity = '0';
                tc.style.transition = 'opacity 0.3s ease-out';
                tc.style.transitionDelay = ((parseInt(c.style.getPropertyValue('--stagger-index')) || 0) * 60) + 'ms';
                requestAnimationFrame(() => { tc.style.opacity = '1'; });
            }
        });
        isRefreshing = false;
    };
    if (pending === 0) {
        finish();
    } else {
        invertMap.forEach(({ card }) => {
            const onEnd = () => {
                card.removeEventListener('transitionend', onEnd);
                card.style.transition = 'none';
                card.style.willChange = 'auto';
                card.style.removeProperty('will-change');
                pending--;
                if (pending === 0) finish();
            };
            card.addEventListener('transitionend', onEnd);
        });
    }
}export function renderHome(animationClass = 'animate-fade-in') {
    const scoreMap = edgeRecommender.scoreAllGames(DB.resources);
    let hasProfile = false;
    for (const [, s] of scoreMap) { if (s > 0) { hasProfile = true; break; } }
    const sortedResources = hasProfile ? [...DB.resources].sort((a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0)) : DB.resources;

    const gameCards = sortedResources.map((res, index) => {
        const cardHtml = renderGameCard(res);
        return cardHtml
            .replace('class="glass-card ', `class="glass-card is-hidden " style="--stagger-index: ${index}"`);
    }).join('');

    const announcementModal = renderModal({
        id: 'announcement-modal',
        image: DB.announcement.image,
        title: DB.announcement.title,
        content: DB.announcement.content,
        buttonText: '鎴戠煡閬撲簡',
        buttonAction: 'close-announcement'
    });

    return `
        <div class="${animationClass ? animationClass + ' ' : ''}space-y-5">
            ${renderCarousel(DB.carouselSlides)}
            <div class="game-cards-container">
                ${gameCards}
            </div>
        </div>
        ${announcementModal}
    `;
}

export function renderHomeSkeleton() {
    const carouselSkel = '<div class="skel-base mb-6" style="width:100%;aspect-ratio:16/9;border-radius:16px"></div>';
    const cardSkels = Array(6).fill(0).map((_, i) =>
        renderCardSkeleton().replace('animation-delay: 0s', `animation-delay: ${i * 0.08}s`)
    ).join('');
    return `
        <div class="space-y-5">
            ${carouselSkel}
            <div class="game-cards-container">
                ${cardSkels}
            </div>
        </div>
    `;
}