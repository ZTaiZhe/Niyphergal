import { DB } from '../foundation/data.js';
import { escapeHtml } from '../foundation/utils.js';


export const ImageViewer = {
    _index: 0,
    _mediaList: [],
    open(mediaList, index) {
        this._mediaList = mediaList || [];
        this._index = index || 0;
    },
    close() {
        this._mediaList = [];
        this._index = 0;
    },
    zoom(scale, cx, cy) {},
    resetZoom() {},
    prev() { if (this._index > 0) this._index--; },
    next() { if (this._index < this._mediaList.length - 1) this._index++; }
};

export function renderBackButton(navigateAction = 'navigate-home') {
    return `
        <button data-action="${navigateAction}" class="w-10 h-10 rounded-full acrylic-panel flex items-center justify-center btn-active cursor-pointer">
            <i class="ri-arrow-left-line text-xl"></i>
        </button>
    `;
}

export function renderTags(tags, variant = 'default') {
    if (!tags || tags.length === 0) return '';
    const tagItems = tags.map(tag => {
        const bg = variant === 'filled' 
            ? 'bg-pink-600/15 text-pink-700 dark:text-pink-300' 
            : 'bg-black/5 text-gray-700 dark:bg-white/10 dark:text-gray-300';
        return `<span class="text-[10px] px-2 py-0.5 rounded-full font-medium ${bg}">${escapeHtml(tag)}</span>`;
    });
    return tagItems.join('');
}

export function renderSectionHeader(title) {
    return `
        <h3 class="font-bold text-sm mb-3 flex items-center gap-2">
            <i class="ri-bookmark-line text-pink-600"></i> ${escapeHtml(title)}
        </h3>
    `;
}

export function renderGlassCard(content, className = '') {
    return `
        <div class="glass-card ${className}">
            ${content}
        </div>
    `;
}

export function renderModal({ id, image, title, content, buttonText, buttonAction }) {
    return `
        <div id="${id}" class="modal-overlay hidden">
            <div class="modal-content glass-card p-8 max-w-sm mx-auto">
                ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" class="w-full rounded-xl mb-4" loading="lazy">` : ''}
                <h2 class="text-xl font-bold mb-2">${escapeHtml(title)}</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">${content}</p>
                <button data-action="${buttonAction}" class="w-full bg-pink-600 text-white py-3 rounded-xl font-bold text-sm btn-active shadow-lg shadow-pink-600/20">${escapeHtml(buttonText)}</button>
            </div>
        </div>
    `;
}

export function renderGameCard(resource, options = {}) {
    const { delay = 0 } = options;

    const fallbackImg = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 224\'%3E%3Crect fill=\'%23333\' width=\'400\' height=\'224\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-size=\'18\' text-anchor=\'middle\' alignment-baseline=\'middle\' font-family=\'sans-serif\' fill=\'%23666\'%3EImage Not Found%3C/text%3E%3C/svg%3E';

    return `
        <div data-action="navigate-detail" data-id="${resource.id}" 
             role="button" tabindex="0"
             class="glass-card btn-active relative flex flex-col overflow-hidden cursor-pointer group h-64">
            
            <img 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 224'%3E%3Crect fill='%231a1a1a' width='400' height='224'/%3E%3C/svg%3E" 
                data-src="${escapeHtml(resource.cover)}" 
                alt="${escapeHtml(resource.title)}"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover z-0 lazy-image"
                data-hero-role="source"
                onerror="this.onerror=null; this.src='${fallbackImg}';"
            >
            
            <div class="card-blur-overlay"></div>
            
            <div class="relative z-10 flex flex-col h-full card-text-container">
                <div class="flex-1 flex flex-col justify-end p-4">
                    <div class="card-title-wrapper relative">
                        <h3 class="font-bold text-lg sm:text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2 leading-snug relative z-10">
                            ${escapeHtml(resource.title)}
                        </h3>
                        <div class="card-title-highlight"></div>
                    </div>
                </div>
                <div class="px-4 pb-4 pt-2 flex flex-wrap gap-1.5 sm:gap-2">
                    ${renderTags(resource.tags)}
                </div>
            </div>
            
        </div>
    `;
}

export function renderComment(comment) {
    return `
        <div class="flex gap-3">
            <div class="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div>
                <div class="text-xs font-bold text-gray-600">${escapeHtml(comment.user)}</div>
                <div class="text-sm mt-0.5">${escapeHtml(comment.text)}</div>
            </div>
        </div>
    `;
}

export function renderVersionCard(version) {
    return `
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <div class="font-bold text-sm">${escapeHtml(version.ver)}</div>
                    <div class="text-[10px] text-gray-400"> ${escapeHtml(version.date)}   ${escapeHtml(version.size)}</div>
                </div>
                <button class="bg-pink-600 text-white text-xs px-3 py-1.5 rounded-lg btn-active" data-action="download">下载</button>
            </div>
            <div class="flex gap-4 mt-3 pt-3 border-t border-gray-200">
                <button class="text-[10px] text-gray-400 flex items-center gap-1 hover:text-red-500 btn-active" data-action="report">
                    <i class="ri-alarm-warning-line"></i> 举报
                </button>
                <button class="text-[10px] text-gray-400 flex items-center gap-1 hover:text-blue-500 btn-active" data-action="feedback">
                    <i class="ri-feedback-line"></i> 反馈
                </button>
            </div>
        </div>
    `;
}

export function renderLockOverlay(message = 'Login to view downloads', actionText = 'Login', action = 'navigate-profile') {
    return `
        <div class="text-center py-6">
            <i class="ri-lock-line text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
            <p class="text-sm text-gray-400 mb-4">${escapeHtml(message)}</p>
            <button data-action="${action}" class="bg-pink-600 text-white px-6 py-2.5 rounded-full text-sm font-bold btn-active">${escapeHtml(actionText)}</button>
        </div>
    `;
}

export function renderUploadArea() {
    return `
        <div class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
            <i class="ri-upload-cloud-2-line text-3xl text-gray-300 dark:text-gray-600 mb-2"></i>
            <p class="text-xs text-gray-400 mb-3">拖拽文件到此处或点击上传</p>
            <button class="bg-pink-600 text-white text-xs px-4 py-2 rounded-full btn-active">选择文件</button>
        </div>
    `;
}

export function renderMediaItem(src, index) {
    return `
        <div class="flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img src="${escapeHtml(src)}" alt="截图 ${index + 1}" class="w-full h-full object-cover" loading="lazy">
        </div>
    `;
}

export function renderMenuItem({ icon, label, value, action, params, isLast, hasArrow = true }) {
    const borderClass = isLast ? '' : 'border-b border-gray-100 dark:border-gray-800';
    const actionAttr = action ? `data-action="${action}"` : '';
    const paramsAttr = params ? `data-params='${JSON.stringify(params)}'` : '';
    return `
        <div ${actionAttr} ${paramsAttr} class="p-4 ${borderClass} flex justify-between items-center cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors">
            <span><i class="${icon} mr-2"></i>${escapeHtml(label)}</span>
            ${value ? `<span class="text-xs ${value === 'Bound' ? 'text-green-500' : ''}">${escapeHtml(value)}</span>` : ''}
            ${hasArrow && !value ? '<i class="ri-arrow-right-s-line text-gray-300 dark:text-gray-600"></i>' : ''}
        </div>
    `;
}

export function renderCommentInput() {
    return `
        <div class="flex gap-3 items-start">
            <div class="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 mt-1"></div>
            <div class="flex-1">
                <textarea class="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-sm resize-none border border-gray-100 dark:border-gray-700 focus:outline-none focus:border-pink-500 transition-colors" rows="3" placeholder="写下你的评论..."></textarea>
                <button class="mt-2 bg-pink-600 text-white text-xs px-4 py-2 rounded-full btn-active">Submit</button>
            </div>
        </div>
    `;
}

export function renderCardSkeleton(delayS = 0) {
    return `
        <div class="glass-card relative flex flex-col overflow-hidden h-64" style="animation-delay: ${delayS}s">
            <div class="absolute inset-0 z-0 skel-base" style="border-radius:0"></div>
            <div class="absolute inset-0 card-blur-overlay" style="z-index:1"></div>
            <div class="relative flex flex-col h-full" style="z-index:10">
                <div class="flex-1 flex flex-col justify-end p-4">
                    <div class="skeleton-text skel-base" style="width:75%;height:20px;border-radius:4px"></div>
                </div>
                <div class="px-4 pb-4 pt-2 flex flex-wrap gap-1.5 sm:gap-2">
                    <div class="skeleton-tag skel-base" style="height:20px;width:50px;border-radius:9999px"></div>
                    <div class="skeleton-tag skel-base" style="height:20px;width:40px;border-radius:9999px"></div>
                    <div class="skeleton-tag skel-base" style="height:20px;width:55px;border-radius:9999px"></div>
                </div>
            </div>
        </div>
    `;
}
