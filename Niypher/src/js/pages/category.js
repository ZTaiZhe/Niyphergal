import { escapeHtml } from '../modules/utils.js';
import { renderCardSkeleton } from '../modules/components.js';
import { renderGlassCard } from '../modules/components.js';

function renderCategoryCard(category) {
    return `
        <div data-action="category-navigate" data-name="${escapeHtml(category.name)}" class="glass-card h-24 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
            <i class="${category.icon} text-2xl"></i>
            <span class="font-bold">${escapeHtml(category.name)}</span>
        </div>
    `;
}

export function renderCategory(animationClass = 'animate-fade-in') {
    const categories = [
        { name: '纯爱系', icon: 'ri-heart-line' },
        { name: '猎奇/致郁', icon: 'ri-emotion-sad-line' },
        { name: '幻想/科幻', icon: 'ri-sword-line' },
        { name: '剧情向', icon: 'ri-book-line' },
        { name: '同人/汉化', icon: 'ri-group-line' },
        { name: '游戏工具', icon: 'ri-tools-line' }
    ];

    const categoryCards = categories.map(c => renderCategoryCard(c)).join('');

    return `
        <div class="${animationClass ? animationClass + ' ' : ''}pt-20">
            <h2 class="text-xl font-bold mb-4 ml-1">Gal </h2>
            <div class="category-cards-container">
                ${categoryCards}
            </div>
        </div>
    `;
}

export function renderCategorySkeleton() {
    const filterBarSkel = '<div class="skel-base mb-4" style="width:100%;height:40px;border-radius:9999px"></div>';
    const cardSkels = Array(6).fill(0).map((_, i) =>
        renderCardSkeleton().replace('animation-delay: 0s', `animation-delay: ${i * 0.08}s`)
    ).join('');
    return `
        <div class="pt-20">
            ${filterBarSkel}
            <div class="category-cards-container">
                ${cardSkels}
            </div>
        </div>
    `;
}