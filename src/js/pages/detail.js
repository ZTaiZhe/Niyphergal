import { DB } from '../modules/foundation/data.js';
import { escapeHtml } from '../modules/foundation/utils.js';
import { getHeroExitContext } from '../modules/ui/animationHelpers.js';
import { renderCardSkeleton } from '../modules/ui/components.js';
import {
    renderBackButton,
    renderTags,
    renderSectionHeader,
    renderLockOverlay,
    renderVersionCard,
    renderUploadArea,
    renderComment,
    renderCommentInput,
    renderMediaItem
} from '../modules/ui/components.js';

export function renderDetail(id) {
    const res = DB.resources.find(r => r.id === Number(id));
    if (!res) return '<div class="p-10 text-center text-gray-500">未找到资源</div>';

    const isLoggedIn = !!DB.user;

    const L0 = `
        <div class="detail-stagger-layer detail-layer-delay-0" data-hero-role="reveal-group">
            <div class="glass-card overflow-hidden mb-6">
                <img src="${escapeHtml(res.cover)}" alt="${escapeHtml(res.title)}"
                     class="detail-hero-img"
                     loading="eager" decoding="async"
                     data-hero-id="${escapeHtml(res.id)}" data-hero-role="target">
                <div class="p-5">
                    <h1 class="text-xl font-bold mb-1 truncate">${escapeHtml(res.title)}</h1>
                    <p class="text-xs text-gray-500 mb-2">${escapeHtml(res.intro ? res.intro.slice(0, 40) + '...' : '')}</p>
                    <div class="flex flex-wrap gap-1 mb-2">${renderTags(res.tags, 'filled')}</div>
                    <button data-action="detail-download" data-id="${escapeHtml(res.id)}"
                            class="w-full bg-pink-600 text-white py-3 rounded-xl font-bold text-sm btn-active shadow-lg shadow-pink-600/20 mt-3">
                        获取资源
                    </button>
                </div>
            </div>
        </div>`;

    const L1 = (res.media && res.media.length > 0) ? `
        <div class="detail-stagger-layer detail-layer-delay-1" data-hero-role="reveal-group">
            <div class="glass-card p-4 mb-6">
                <h3 class="font-bold text-sm mb-3 flex items-center gap-2">
                    <i class="ri-image-line text-pink-600"></i> 预览截图
                </h3>
                <div class="screenshot-gallery pb-2">
                    ${res.media.map((media, i) => `
                        <div class="screenshot-item">
                            <img loading="lazy" decoding="async" data-src="${escapeHtml(media.url || media)}"
                                 alt="截图 ${i+1}" class="screenshot-img"
                                 style="opacity:0;" onload="this.style.opacity='1'">
                        </div>
                    `).join('')}
                </div>
                <p class="text-[10px] text-gray-400 mt-2 text-center">左右滑动查看更多</p>
            </div>
        </div>` : '';

    const L2 = `
        <div class="detail-stagger-layer detail-layer-delay-2" data-hero-role="reveal-group">
            <div class="glass-card p-5 mb-6">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-bold text-sm">简介</h3>
                </div>
                <div class="description-text" id="detail-description">
                    <p class="text-sm text-gray-600 leading-relaxed">${escapeHtml(res.intro)}</p>
                </div>
                ${res.intro && res.intro.length > 100 ? `
                <button id="description-toggle" class="text-pink-600 text-xs font-bold mt-2 flex items-center gap-1"
                        data-expanded="false" aria-expanded="false">
                    展开全文 <i class="ri-arrow-down-s-line"></i>
                </button>` : ''}
            </div>
        </div>`;

    const L3 = `
        <div class="detail-stagger-layer detail-layer-delay-3" data-hero-role="reveal-group">
            <div class="glass-card p-5 mb-6">
                <h3 class="font-bold text-sm mb-3">评分</h3>
                <div class="flex items-center gap-4 mb-3">
                    <span class="text-4xl font-bold text-pink-600">${res.rating || '8.5'}</span>
                    <div class="flex flex-col gap-1">
                        <div class="flex text-yellow-400 text-sm">${'★'.repeat(Math.round((res.rating || 8.5) / 2))}${'☆'.repeat(5 - Math.round((res.rating || 8.5) / 2))}</div>
                        <span class="text-xs text-gray-400">基于社区评分</span>
                    </div>
                </div>
                ${[5,4,3,2,1].map(star => {
                    const pct = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1;
                    return `
                    <div class="flex items-center gap-2 mb-1.5 text-xs">
                        <span class="w-4 text-right text-gray-500">${star}</span>
                        <span class="text-yellow-400">★</span>
                        <div class="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full bg-pink-500 rounded-full" style="width:${pct}%"></div>
                        </div>
                        <span class="w-8 text-right text-gray-400">${pct}%</span>
                    </div>`;
                }).join('')}
            </div>
        </div>`;

    const L4 = `
        <div class="detail-stagger-layer detail-layer-delay-4" data-hero-role="reveal-group">
            <div class="glass-card p-5 mb-6">
                <h3 class="font-bold text-sm mb-3">信息</h3>
                <div class="grid grid-cols-2 gap-3">
                    ${[['大小', res.size || '未知'], ['日期', res.date || res.releaseDate || '待定'],
                       ['语言', res.language || '中文'], ['平台', res.platform || 'PC'],
                       ['评分', (res.rating || '8.5') + '/10'], ['社团', res.developer || res.author || '未知']]
                       .map(([k, v]) => `
                        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                            <div class="text-[10px] text-gray-400 mb-0.5">${k}</div>
                            <div class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">${escapeHtml(String(v))}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="glass-card p-5 mb-6">
                ${renderSectionHeader('资源下载')}
                ${!isLoggedIn ? renderLockOverlay() :
                  `<div class="space-y-3">${res.versions.length === 0 ? '<p class="text-sm text-gray-400">暂无资源版本</p>' : ''}${res.versions.map(v => renderVersionCard(v)).join('')}</div>`}
            </div>
            <div class="glass-card p-5 mb-6">
                ${renderSectionHeader('贡献上传')}
                ${!isLoggedIn ? '<p class="text-xs text-gray-400 pl-4">登录后可提交新版本</p>' : renderUploadArea()}
            </div>
            <div class="glass-card p-5">
                ${renderSectionHeader('评论交流')}
                <div class="space-y-5 mb-6">${(DB.comments || []).map(c => renderComment(c)).join('')}</div>
                ${renderCommentInput()}
            </div>
        </div>`;

    return `
        <div class="pb-10 pt-20 detail-page-container" style="visibility:hidden">
            ${L0}
            ${L1}
            ${L2}
            ${L3}
            ${L4}
        </div>
    `;
}

var _descToggleBound = false;

function _bindDescToggle() {
    if (_descToggleBound) return;
    var descToggle = document.getElementById('description-toggle');
    var descText = document.getElementById('detail-description');
    if (descToggle && descText) {
        _descToggleBound = true;
        descToggle.addEventListener('click', function() {
            var expanded = descToggle.getAttribute('data-expanded') === 'true';
            descToggle.setAttribute('data-expanded', String(!expanded));
            descToggle.setAttribute('aria-expanded', String(!expanded));
            descText.setAttribute('aria-hidden', String(expanded));
            descText.style.maxHeight = expanded ? '4.5em' : 'none';
            descText.style.overflow = expanded ? 'hidden' : 'visible';
            descToggle.innerHTML = expanded
                ? '展开全文 <i class="ri-arrow-down-s-line"></i>'
                : '收起 <i class="ri-arrow-up-s-line"></i>';
        });
    }
}

function _showDetailPage() {
    var section = document.querySelector('section[data-page="detail"]');
    if (!section) return;
    section.style.visibility = 'visible';
    var inner = section.querySelector('.detail-page-container');
    if (inner) inner.style.visibility = 'visible';
}

export function initDetailAnimations() {
    _descToggleBound = false;
    _showDetailPage();

    var layers = document.querySelectorAll('.detail-stagger-layer');
    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            layers.forEach(function(layer) { layer.classList.add('is-visible'); });
        });
    });

    _bindDescToggle();
}

var _heroTransition = false;

export function setHeroTransition(v) {
    _heroTransition = v;
}

export function getHeroTransition() {
    return _heroTransition;
}

export function revealDetailContent() {
    _descToggleBound = false;
    _showDetailPage();

    var section = document.querySelector('section[data-page="detail"]');
    if (!section) return;

    var layers = section.querySelectorAll('.detail-stagger-layer');
    if (layers.length > 0) {
        if (!layers[0].classList.contains('is-visible')) {
            layers[0].style.transition = 'none';
            layers[0].classList.add('is-visible');
            void layers[0].offsetHeight;
            layers[0].style.transition = '';
        }
        if (layers.length > 1) {
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    for (var i = 1; i < layers.length; i++) {
                        layers[i].classList.add('is-visible');
                    }
                });
            });
        }
    }

    _bindDescToggle();
}

export function renderDetailSkeleton() {
    return `
        <div class="pb-10 pt-20 detail-page-container">
            <div class="skel-base mb-4" style="width:120px;height:32px;border-radius:8px"></div>
            <div class="glass-card overflow-hidden mb-6">
                <div class="skel-base" style="width:100%;aspect-ratio:16/9;border-radius:0"></div>
                <div class="p-5">
                    <div class="skeleton-text skel-base mb-2" style="width:60%"></div>
                    <div class="skeleton-text skel-base mb-3" style="width:40%"></div>
                    <div class="flex flex-wrap gap-1 mb-2">
                        <div class="skeleton-tag skel-base"></div>
                        <div class="skeleton-tag skel-base" style="width:40px"></div>
                        <div class="skeleton-tag skel-base" style="width:55px"></div>
                    </div>
                    <div class="skel-base" style="width:100%;height:48px;border-radius:12px"></div>
                </div>
            </div>
            <div class="glass-card p-4 mb-6">
                <div class="skeleton-text skel-base mb-3" style="width:30%"></div>
                <div class="skeleton-text skel-base mb-2" style="width:100%"></div>
                <div class="skeleton-text skel-base mb-2" style="width:90%"></div>
                <div class="skeleton-text skel-base" style="width:60%"></div>
            </div>
            <div class="glass-card p-5 mb-6">
                <div class="skeleton-text skel-base mb-3" style="width:25%"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="skel-base" style="height:56px;border-radius:8px"></div>
                    <div class="skel-base" style="height:56px;border-radius:8px"></div>
                    <div class="skel-base" style="height:56px;border-radius:8px"></div>
                    <div class="skel-base" style="height:56px;border-radius:8px"></div>
                </div>
            </div>
        </div>
    `;
}