import { escapeHtml } from './utils.js';

export const SearchUIRenderer = {
    ICON_MAP: {
        'game': 'gamepad-2',
        'tag': 'hash',
        'developer': 'building-4',
        'vndb': 'database-2',
        'history': 'time-line',
        'hot': 'fire-line'
    },

    getIcon: function(type) {
        return this.ICON_MAP[type] || 'search';
    },

    renderSuggestions: function(suggestions, currentIndex, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        const self = this;
        const html = suggestions.map(function(item, index) {
            const icon = self.getIcon(item.type);
            const activeClass = index === currentIndex ? 'bg-pink-50 dark:bg-pink-900/30 font-medium' : '';
            const fuzzyMark = item.isFuzzy ? '<span class="ml-1 text-xs text-purple-400 dark:text-purple-500">~</span>' : '';

            return `<div class="search-suggestion-item flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors ${activeClass}" data-index="${index}" data-text="${escapeHtml(item.text)}" data-id="${escapeHtml(item.id)}" data-type="${escapeHtml(item.type)}">
                <i class="ri-${icon}-line text-gray-500 dark:text-gray-400 mr-2"></i>
                <span>${escapeHtml(item.text)}</span>
                ${fuzzyMark}
            </div>`;
        }).join('');

        container.innerHTML = '<div class="suggestions-items-container">' + html + '</div>';
    },

    renderDefaultSuggestions: function(history, hotSearches, defaultTags, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        const suggestions = [];

        history.forEach(function(h) {
            suggestions.push({
                text: h,
                type: 'history',
                score: 90,
                id: null
            });
        });

        hotSearches.forEach(function(h) {
            suggestions.push({
                text: h,
                type: 'hot',
                score: 80,
                id: null
            });
        });

        if (suggestions.length === 0) {
            defaultTags.forEach(function(tag) {
                suggestions.push({
                    text: tag,
                    type: 'tag',
                    score: 70,
                    id: null
                });
            });
        }

        this._renderDefaultHTML(suggestions, container);
    },

    _renderDefaultHTML: function(suggestions, container) {
        let html = '<div class="suggestions-items-container">';

        const historyItems = suggestions.filter(function(s) { return s.type === 'history'; });
        const hotItems = suggestions.filter(function(s) { return s.type === 'hot'; });
        const tagItems = suggestions.filter(function(s) { return s.type === 'tag'; });

        if (historyItems.length > 0) {
            html += '<div class="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 font-medium">搜索历史</div>';
            historyItems.forEach(function(item, index) {
                html += '<div class="search-suggestion-item flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors" data-index="' + index + '" data-text="' + escapeHtml(item.text) + '" data-id="" data-type="' + item.type + '">'
                    + '<i class="ri-time-line text-gray-400 dark:text-gray-500 mr-2"></i>'
                    + '<span>' + escapeHtml(item.text) + '</span>'
                    + '<i class="ri-close-line text-gray-300 dark:text-gray-600 ml-auto text-xs history-delete" data-query="' + escapeHtml(item.text) + '"></i>'
                    + '</div>';
            });
        }

        if (hotItems.length > 0) {
            html += '<div class="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 font-medium">热门搜索</div>';
            hotItems.forEach(function(item, index) {
                const actualIndex = historyItems.length + index;
                html += '<div class="search-suggestion-item flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors" data-index="' + actualIndex + '" data-text="' + escapeHtml(item.text) + '" data-id="" data-type="' + item.type + '">'
                    + '<i class="ri-fire-line text-orange-400 mr-2"></i>'
                    + '<span>' + escapeHtml(item.text) + '</span>'
                    + '</div>';
            });
        }

        if (tagItems.length > 0) {
            html += '<div class="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 font-medium">猜你想搜</div>';
            tagItems.forEach(function(item, index) {
                const actualIndex = historyItems.length + hotItems.length + index;
                html += '<div class="search-suggestion-item flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors" data-index="' + actualIndex + '" data-text="' + escapeHtml(item.text) + '" data-id="" data-type="' + item.type + '">'
                    + '<i class="ri-hash text-gray-400 dark:text-gray-500 mr-2"></i>'
                    + '<span>' + escapeHtml(item.text) + '</span>'
                    + '</div>';
            });
        }

        html += '</div>';
        container.innerHTML = html;
    },

    updateSelection: function(currentIndex) {
        const items = document.querySelectorAll('.search-suggestion-item');

        if (!items.length) {
            return;
        }

        if (currentIndex === -1) {
            items.forEach(function(item) {
                item.classList.remove('bg-pink-50', 'dark:bg-pink-900/30', 'font-medium');
            });
            return;
        }

        items.forEach(function(item, index) {
            if (index === currentIndex) {
                item.classList.add('bg-pink-50', 'dark:bg-pink-900/30', 'font-medium');
            } else {
                item.classList.remove('bg-pink-50', 'dark:bg-pink-900/30', 'font-medium');
            }
        });
    },

    renderPagination: function(currentPage, totalPages, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        if (totalPages <= 1) {
            container.classList.add('hidden');
            return;
        }

        let html = '<div class="flex space-x-2">';

        if (currentPage > 1) {
            html += '<button class="pagination-btn w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors glass-card" data-direction="prev">'
                + '<i class="ri-arrow-left-s-line text-gray-600 dark:text-gray-400"></i>'
                + '</button>';
        }

        if (currentPage < totalPages) {
            html += '<button class="pagination-btn w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors glass-card" data-direction="next">'
                + '<i class="ri-arrow-right-s-line text-gray-600 dark:text-gray-400"></i>'
                + '</button>';
        }

        html += '</div>';

        container.innerHTML = html;
        container.classList.remove('hidden');
    },

    showContainer: function(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.remove('hidden');
            container.classList.add('animate-fade-in');
        }
    },

    hideContainer: function(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.add('hidden');
            container.classList.remove('animate-fade-in');
        }
    }
};
