import { DB } from '../modules/data.js';
import { escapeHtml } from '../modules/utils.js';
import { renderGameCard } from '../modules/components.js';
import { SearchIndex } from '../modules/searchIndex.js';
import { processResults } from '../modules/searchHelper.js';
import edgeRecommender from '../modules/recommendation.js';

const enable_partial_refresh = true;

let currentAbortController = null;
const currentState = {
    keyword: '',
    sortKey: '',
    order: 'desc',
    filterType: '',
    page: 1
};

/**
 * 鎵ц鏍稿績鎼滅储閫昏緫锛氱储寮曟煡璇?鈫?鎺ㄨ崘鍒嗘暟褰掍竴鍖?鈫?缁撴灉鎺掑簭杩囨护
 * @param {string} keyword - 鎼滅储鍏抽敭璇? * @param {string} sortKey - 鎺掑簭瀛楁
 * @param {string} order - 鎺掑簭椤哄簭 ('asc' | 'desc')
 * @param {string} filterType - 杩囨护绫诲瀷
 * @returns {Array} 澶勭悊鍚庣殑娓告垙鍒楄〃
 */
function _executeSearchLogic(keyword, sortKey, order, filterType) {
    const searchResults = SearchIndex.search(keyword);
    let games = [];

    if (searchResults.length > 0) {
        const gameIds = searchResults.map(result => result.id);
        games = DB.resources.filter(resource => gameIds.includes(resource.id));
        games.sort((a, b) => gameIds.indexOf(a.id) - gameIds.indexOf(b.id));
    }

    const recScoreMap = edgeRecommender.scoreAllGames(DB.resources);
    let maxRecScore = 0;
    for (const [, s] of recScoreMap) { if (s > maxRecScore) maxRecScore = s; }
    const normalizedRecScores = new Map();
    for (const [id, s] of recScoreMap) {
        normalizedRecScores.set(id, maxRecScore === 0 ? 0 : (s / maxRecScore) * 100);
    }
    const searchScoreMap = new Map(searchResults.map(r => [r.id, r.score]));

    return processResults(games, sortKey, filterType, order, normalizedRecScores, searchScoreMap);
}

/**
 * 鏍规嵁鎼滅储缁撴灉鐢熸垚 HTML锛堝惈缁撴灉澶村拰鍗＄墖鍒楄〃锛? * @param {string} keyword - 鎼滅储鍏抽敭璇? * @param {Array} games - 澶勭悊鍚庣殑娓告垙鍒楄〃
 * @param {string} sortKey - 鎺掑簭瀛楁
 * @param {string} filterType - 杩囨护绫诲瀷
 * @param {string} order - 鎺掑簭椤哄簭
 * @returns {string} HTML 瀛楃涓? */
function _generateSearchResultsHTML(keyword, games, sortKey, filterType, order) {
    if (games.length === 0) {
        return renderResultsHeader(keyword, 0, sortKey, filterType, order) + renderNoResults(keyword);
    }

    const gameCards = games.map((res, index) => {
        const delay = Math.min(index * 50, 400);
        return renderGameCard(res, { delay });
    }).join('');

    return renderResultsHeader(keyword, games.length, sortKey, filterType, order) + `
        <div class="game-cards-container" role="region" aria-live="polite" aria-busy="false" aria-label="鎼滅储缁撴灉鍒楄〃">
            ${gameCards}
        </div>
    `;
}

export function renderSearch(params, animationClass = 'animate-fade-in', options = {}) {
    const { partialRefresh = false, resetPage = false } = options;

    if (currentAbortController) {
        currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    const keyword = params.q || '';
    const sortKey = params.sort || '';
    const order = params.order || 'desc';
    const filterType = params.filter || '';

    const isCoreChange = keyword !== currentState.keyword;
    const isFilterChange = sortKey !== currentState.sortKey ||
                           order !== currentState.order ||
                           filterType !== currentState.filterType;

    if (resetPage || isCoreChange || isFilterChange) {
        currentState.page = 1;
    }

    currentState.keyword = keyword;
    currentState.sortKey = sortKey;
    currentState.order = order;
    currentState.filterType = filterType;

    document.title = keyword ? `${keyword} - 鎼滅储` : '鎼滅储';

    if (enable_partial_refresh && partialRefresh && !isCoreChange) {
        return renderSearchResultsOnly(params);
    }

    let resultsHtml = '';

    if (keyword.trim() === '') {
        resultsHtml = renderEmptySearch();
    } else {
        const processedGames = _executeSearchLogic(keyword, sortKey, order, filterType);
        resultsHtml = _generateSearchResultsHTML(keyword, processedGames, sortKey, filterType, order);
    }

    return `
        <div class="${animationClass ? animationClass + ' ' : ''}space-y-5 pt-20" aria-live="polite">
            ${resultsHtml}
        </div>
    `;
}

export function renderSearchResults(params) {
    if (currentAbortController) {
        currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    const keyword = params.q || '';
    const sortKey = params.sort || '';
    const order = params.order || 'desc';
    const filterType = params.filter || '';

    const isCoreChange = keyword !== currentState.keyword;
    const isFilterChange = sortKey !== currentState.sortKey ||
                           order !== currentState.order ||
                           filterType !== currentState.filterType;

    if (isCoreChange || isFilterChange) {
        currentState.page = 1;
    }

    currentState.keyword = keyword;
    currentState.sortKey = sortKey;
    currentState.order = order;
    currentState.filterType = filterType;

    document.title = keyword ? `${keyword} - 鎼滅储` : '鎼滅储';

    if (keyword.trim() === '') {
        return renderEmptySearch();
    }

    const processedGames = _executeSearchLogic(keyword, sortKey, order, filterType);
    return _generateSearchResultsHTML(keyword, processedGames, sortKey, filterType, order);
}

export function updateFilterButtons(sortKey, filterType, order = 'desc') {
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(btn => {
        const btnSort = btn.dataset.sort || '';
        btn.classList.toggle('active', btnSort === sortKey);
        btn.setAttribute('aria-pressed', btnSort === sortKey);
    });

    const filterButtons = document.querySelectorAll('.filter-btn, .filter-btn-mobile');
    filterButtons.forEach(btn => {
        const btnFilter = btn.dataset.filter || '';
        btn.classList.toggle('active', btnFilter === filterType);
        btn.setAttribute('aria-pressed', btnFilter === filterType);
    });

    const orderButtons = document.querySelectorAll('.order-toggle-btn');
    orderButtons.forEach(btn => {
        const btnOrder = btn.dataset.order;
        btn.classList.toggle('active', btnOrder === order);
    });
}

export function getCurrentState() {
    return { ...currentState };
}

export function resetPage() {
    currentState.page = 1;
}

function renderSearchResultsOnly(params) {
    const keyword = params.q || '';
    const sortKey = params.sort || '';
    const order = params.order || 'desc';
    const filterType = params.filter || '';

    if (keyword.trim() === '') {
        return renderEmptySearch();
    }

    const processedGames = _executeSearchLogic(keyword, sortKey, order, filterType);
    return _generateSearchResultsHTML(keyword, processedGames, sortKey, filterType, order);
}

function renderEmptySearch() {
    const searchInput = document.getElementById('header-search');
    if (searchInput && document.activeElement === searchInput) {
    } else if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
    }

    return `
        <div class="empty-state">
            <div class="empty-state-icon">
                <div class="icon-circle">
                    <i class="ri-search-line"></i>
                </div>
                <div class="icon-ring"></div>
                <div class="icon-ring delay-1"></div>
                <div class="icon-ring delay-2"></div>
            </div>
            <h2 class="empty-state-title">鎼滅储娓告垙</h2>
            <p class="empty-state-desc">杈撳叆鍏抽敭璇嶅紑濮嬫悳绱?/p>
            <div class="empty-state-tips">
                <div class="tip-item">
                    <i class="ri-lightbulb-line"></i>
                    <span>杈撳叆娓告垙鍚嶇О銆佹爣绛炬悳绱?/span>
                </div>
                <div class="tip-item">
                    <i class="ri-magic-line"></i>
                    <span>鏀寔妯＄硦鎼滅储涓庢嫾闊虫悳绱?/span>
                </div>
            </div>
        </div>
    `;
}

export function renderNoResults(keyword) {
    return `
        <div class="no-results-state">
            <div class="no-results-icon">
                <div class="icon-wrapper">
                    <i class="ri-search-eye-line"></i>
                </div>
                <div class="searching-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <h2 class="no-results-title">鏈壘鍒扮粨鏋?/h2>
            <p class="no-results-desc">鏈壘鍒?"<span class="keyword-highlight">${escapeHtml(keyword)}</span>" 鐨勭浉鍏冲唴瀹?/p>
            <div class="no-results-suggestions">
                <h3 class="suggestions-title">鎼滅储寤鸿</h3>
                <ul class="suggestions-list">
                    <li><i class="ri-checkbox-blank-circle-line"></i> 妫€鏌ヨ緭鍏ユ槸鍚︽纭?/li>
                    <li><i class="ri-checkbox-blank-circle-line"></i> 灏濊瘯浣跨敤鏇寸煭鐨勫叧閿瘝</li>
                    <li><i class="ri-checkbox-blank-circle-line"></i> 浣跨敤娓告垙鍚嶇О鎴栨爣绛炬悳绱?/li>
                    <li><i class="ri-checkbox-blank-circle-line"></i> 灏濊瘯妯＄硦鎼滅储鎴栨嫾闊虫悳绱?/li>
                </ul>
            </div>
            <div class="no-results-actions">
                <button data-action="search-back-home" class="btn-back-home">
                    <i class="ri-home-4-line"></i>
                    杩斿洖棣栭〉
                </button>
            </div>
        </div>
    `;
}

export function renderNetworkError(keyword) {
    return `
        <div class="network-error-state glass-card">
            <div class="error-icon-wrapper">
                <div class="error-icon">
                    <i class="ri-wifi-off-line"></i>
                </div>
                <div class="error-pulse"></div>
            </div>
            <h2 class="error-title">缃戠粶杩炴帴澶辫触</h2>
            <p class="error-desc">璇锋鏌ョ綉缁滆繛鎺ュ悗閲嶈瘯</p>
            <div class="error-actions">
                <button data-action="search-retry" class="btn-retry" data-keyword="${escapeHtml(keyword)}">
                    <i class="ri-refresh-line"></i>
                    閲嶈瘯
                </button>
                <button data-action="search-reload" class="btn-reload">
                    <i class="ri-restart-line"></i>
                    鍒锋柊
                </button>
            </div>
            <div class="error-tips">
                <span><i class="ri-information-line"></i> 缃戠粶寮傚父鏃跺皢鏄剧ず缂撳瓨鍐呭</span>
            </div>
        </div>
    `;
}

export function renderSearchSkeleton() {
    const skeletonCards = Array(6).fill(0).map((_, i) => `
        <div class="skeleton-card" style="animation-delay: ${i * 0.1}s">
            <div class="skeleton-image-wrapper">
                <div class="skeleton-image skel-base"></div>
            </div>
            <div class="skeleton-content">
                <div class="skeleton-text skel-base"></div>
                <div class="skeleton-tags">
                    <div class="skeleton-tag skel-base"></div>
                    <div class="skeleton-tag skel-base"></div>
                    <div class="skeleton-tag skel-base"></div>
                </div>
            </div>
        </div>
    `).join('');

    return `
        <div class="search-skeleton">
            <div class="skeleton-header">
                <div class="skeleton-text skel-base" style="width:120px"></div>
                <div class="skeleton-text skel-base" style="width:60px"></div>
            </div>
            <div class="skeleton-filters">
                <div class="skeleton-filter-group">
                    <div class="skeleton-text skel-base" style="width:40px"></div>
                    <div class="skeleton-buttons">
                        <div class="skeleton-tag skel-base"></div>
                        <div class="skeleton-tag skel-base"></div>
                        <div class="skeleton-tag skel-base"></div>
                    </div>
                </div>
                <div class="skeleton-filter-group">
                    <div class="skeleton-text skel-base" style="width:40px"></div>
                    <div class="skeleton-buttons">
                        <div class="skeleton-tag skel-base"></div>
                        <div class="skeleton-tag skel-base"></div>
                        <div class="skeleton-tag skel-base"></div>
                        <div class="skeleton-tag skel-base"></div>
                    </div>
                </div>
            </div>
            <div class="skeleton-cards-grid">
                ${skeletonCards}
            </div>
        </div>
    `;
}

export function renderCardsSkeleton() {
    const skeletonCards = Array(6).fill(0).map((_, i) => `
        <div class="skeleton-card" style="animation-delay: ${i * 0.1}s">
            <div class="skeleton-image-wrapper">
                <div class="skeleton-image skel-base"></div>
            </div>
            <div class="skeleton-content">
                <div class="skeleton-text skel-base"></div>
                <div class="skeleton-tags">
                    <div class="skeleton-tag skel-base"></div>
                    <div class="skeleton-tag skel-base"></div>
                    <div class="skeleton-tag skel-base"></div>
                </div>
            </div>
        </div>
    `).join('');

    return `
        <div class="skeleton-cards-grid">
            ${skeletonCards}
        </div>
    `;
}

function renderResultsHeader(keyword, count, sortKey, filterType, order = 'desc') {
    const sortOptions = [
        { key: '', label: '榛樿', icon: 'ri-sort-default' },
        { key: 'title', label: '鏍囬', icon: 'ri-sort-asc' },
        { key: 'date', label: '鏃ユ湡', icon: 'ri-time-line' }
    ];

    const filterOptions = [
        { key: '', label: '鍏ㄩ儴', icon: 'ri-apps-line' },
        { key: 'GAL', label: 'GAL', icon: 'ri-gamepad-line' },
        { key: 'RPG', label: 'RPG', icon: 'ri-sword-line' },
        { key: '鍐掗櫓', label: '鍐掗櫓', icon: 'ri-compass-3-line' },
        { key: '鍔ㄤ綔', label: '鍔ㄤ綔', icon: 'ri-flashlight-line' },
        { key: '妯℃嫙', label: '妯℃嫙', icon: 'ri-settings-3-line' },
        { key: '绉戝够', label: '绉戝够', icon: 'ri-rocket-line' },
        { key: '浼戦棽', label: '浼戦棽', icon: 'ri-cup-line' }
    ];

    const isEmptyResults = false;
    const showOrderToggle = sortKey !== '' && sortKey !== undefined;

    const sortButtons = sortOptions.map(option => `
        <button class="sort-btn btn-ripple ${option.key === sortKey ? 'active' : ''} ${isEmptyResults ? 'disabled' : ''}"
            data-sort="${option.key}"
            ${isEmptyResults ? 'disabled' : ''}
            aria-pressed="${option.key === sortKey}">
            <i class="${option.icon}"></i>
            <span>${option.label}</span>
        </button>
    `).join('');

    const orderToggleHtml = showOrderToggle ? `
        <div class="order-toggle-group">
            <button class="order-toggle-btn btn-ripple ${order === 'desc' ? 'active' : ''}"
                data-order="desc"
                ${isEmptyResults ? 'disabled' : ''}
                aria-label="闄嶅簭"
                title="闄嶅簭">
                <i class="ri-sort-desc"></i>
            </button>
            <button class="order-toggle-btn btn-ripple ${order === 'asc' ? 'active' : ''}"
                data-order="asc"
                ${isEmptyResults ? 'disabled' : ''}
                aria-label="鍗囧簭"
                title="鍗囧簭">
                <i class="ri-sort-asc"></i>
            </button>
        </div>
    ` : '';

    const filterButtonsDesktop = filterOptions.map(option => `
        <button class="filter-btn btn-ripple ${option.key === filterType ? 'active' : ''} ${isEmptyResults ? 'disabled' : ''}"
            data-filter="${option.key}"
            ${isEmptyResults ? 'disabled' : ''}
            aria-pressed="${option.key === filterType}">
            <i class="${option.icon}"></i>
            <span>${option.label}</span>
        </button>
    `).join('');

    const filterButtonsMobile = filterOptions.map(option => `
        <button class="filter-btn-mobile btn-ripple ${option.key === filterType ? 'active' : ''} ${isEmptyResults ? 'disabled' : ''}"
            data-filter="${option.key}"
            ${isEmptyResults ? 'disabled' : ''}
            aria-pressed="${option.key === filterType}">
            ${option.label}
        </button>
    `).join('');

    return `
        <div class="search-header glass-card">
            <div class="search-header-top">
                <div class="search-keyword">
                    <span class="search-label">鎼滅储</span>
                    <span class="search-term">"${escapeHtml(keyword)}"</span>
                </div>
                <div class="search-count">
                    <span class="count-number">${count}</span>
                    <span class="count-text">涓粨鏋?/span>
                </div>
            </div>

            <!--  -->
            <div class="search-filters desktop-filters">
                <div class="filter-group">
                    <span class="filter-label">
                        <i class="ri-sort-desc"></i>
                        鎺掑簭
                    </span>
                    <div class="filter-buttons sort-buttons">
                        ${sortButtons}
                    </div>
                    ${orderToggleHtml}
                </div>
                <div class="filter-group">
                    <span class="filter-label">
                        <i class="ri-filter-3"></i>
                        绛涢€?                    </span>
                    <div class="filter-buttons filter-buttons-desktop">
                        ${filterButtonsDesktop}
                    </div>
                </div>
            </div>

            <!--  -->
            <div class="search-filters mobile-filters">
                <div class="filter-group">
                    <span class="filter-label">
                        <i class="ri-sort-desc"></i>
                        鎺掑簭
                    </span>
                    <div class="filter-buttons sort-buttons">
                        ${sortButtons}
                    </div>
                    ${orderToggleHtml}
                </div>
                <div class="filter-group filter-group-collapsible">
                    <button class="filter-expand-btn" aria-expanded="false">
                        <span class="filter-label">
                            <i class="ri-filter-3"></i>
                            绛涢€?                            ${filterType ? `<span class="filter-badge">${filterOptions.find(f => f.key === filterType)?.label || ''}</span>` : ''}
                        </span>
                        <i class="ri-arrow-down-s-line expand-icon"></i>
                    </button>
                    <div class="filter-buttons-mobile">
                        ${filterButtonsMobile}
                    </div>
                </div>
            </div>
        </div>
    `;
}
