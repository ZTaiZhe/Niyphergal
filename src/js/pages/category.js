import { escapeHtml } from '../modules/foundation/utils.js';
import { renderGlassCard } from '../modules/ui/components.js';

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
        { name: 'Pure Love', icon: 'ri-heart-line' },
        { name: '猎奇/致郁', icon: 'ri-emotion-sad-line' },
        { name: '幻想/科幻', icon: 'ri-sword-line' },
        { name: 'Story', icon: 'ri-book-line' },
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
    const titleSkel = '<div class="skel-base mb-4" style="width:80px;height:28px;border-radius:6px"></div>';
    const skeletonCard = (i) => `
        <div class="glass-card h-24 flex flex-col items-center justify-center gap-2" style="animation-delay: ${i * 0.08}s">
            <div class="skel-base" style="width:24px;height:24px;border-radius:6px"></div>
            <div class="skel-base" style="width:60%;height:16px;border-radius:4px"></div>
        </div>`;
    const cardSkels = Array(6).fill(0).map((_, i) => skeletonCard(i)).join('');
    return `
        <div class="pt-20">
            ${titleSkel}
            <div class="category-cards-container">
                ${cardSkels}
            </div>
        </div>
    `;
}
