import { debounce, escapeHtml } from '../foundation/utils.js';
import { CONFIG } from '../foundation/config.js';
import { LRUCache, CACHE_CONFIG } from '../engine/cache.js';
import { router } from '../foundation/router.js';
import { SearchHistoryManager } from './searchHistoryManager.js';
import { HotSearchManager } from './hotSearchManager.js';
import { SuggestionGenerator } from './suggestionGenerator.js';
import { PaginationManager } from '../foundation/paginationManager.js';
import { SearchUIRenderer } from './searchUIRenderer.js';

export class SearchController {
    constructor() {
        this.state = {
            searchHistory: [],
            searchFrequency: {},
            hotSearches: [],
            suggestions: [],
            currentIndex: -1,
            isSelecting: false,
            lastQuery: ''
        };

        this.searchCache = new LRUCache(CACHE_CONFIG.MAX_SIZE, CACHE_CONFIG.TTL);
        this.pagination = new PaginationManager(CONFIG.SEARCH.SUGGESTIONS_PER_PAGE);
        this.cleanupInterval = null;
        this.clearTimer = null;
    }

    init() {
        const searchInput = document.getElementById('header-search');
        const suggestionContainer = document.getElementById('search-suggestions');
        const searchBtn = document.getElementById('header-search-btn');

        if (!searchInput || !suggestionContainer) {
            return;
        }

        this._loadSearchData();

        searchInput.addEventListener('input', debounce((e) => {
            const query = e.target.value.trim();
            this.handleInput(query);
        }, CONFIG.SEARCH.DEBOUNCE_DELAY));

        searchInput.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        searchInput.addEventListener('focus', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                this.handleInput(query);
            } else {
                this.showDefaultSuggestions();
            }
        });

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchText = searchInput.value.trim();
                if (searchText) {
                    this.navigateToSearch(searchText);
                }
            });
        }

        document.addEventListener('click', (e) => {
            const searchArea = e.target.closest('#desktop-search-container');
            const paginationContainer = e.target.closest('#search-pagination');
            if (!searchArea && !paginationContainer) {
                this.clearSuggestions();
            }
        });

        this.cleanupInterval = setInterval(() => {
            this.searchCache.cleanup();
        }, 60 * 1000);

        window.addEventListener('beforeunload', () => {
            this.destroy();
        });

        window.addEventListener('popstate', () => {
            this.syncInputFromURL();
        });

        this.syncInputFromURL();
    }

    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.searchCache.clear();
        this.state.suggestions = [];
        this.clearTimer = null;
    }

    _loadSearchData() {
        this.state.searchHistory = SearchHistoryManager.loadHistory();
        this.state.searchFrequency = SearchHistoryManager.loadFrequency();
        this.state.hotSearches = HotSearchManager.calculateHotSearches(this.state.searchFrequency);
    }

    handleInput(query) {
        if (query.length === 0) {
            this.clearSuggestions();
            return;
        }

        if (query !== this.state.lastQuery) {
            this.pagination.reset();
            this.state.lastQuery = query;
        }

        if (this.searchCache.has(query)) {
            const cachedSuggestions = this.searchCache.get(query);
            this._displaySuggestions(cachedSuggestions);
            return;
        }

        const suggestions = SuggestionGenerator.generateSuggestions(query);
        this.searchCache.set(query, suggestions);
        this._displaySuggestions(suggestions);
    }

    _displaySuggestions(suggestions) {
        const container = document.getElementById('search-suggestions');
        const paginationContainer = document.getElementById('search-pagination');

        if (this.clearTimer) {
            clearTimeout(this.clearTimer);
            this.clearTimer = null;
        }

        if (suggestions.length === 0) {
            container.classList.add('hidden');
            if (paginationContainer) {
                paginationContainer.classList.add('hidden');
            }
            return;
        }

        this.state.suggestions = suggestions;
        this.pagination.calculateTotalPages(suggestions.length);
        this.state.currentIndex = -1;
        this.state.isSelecting = false;

        const currentPageSuggestions = this.pagination.getCurrentPageItems(suggestions);

        container.classList.remove('animate-slide-out-left', 'animate-slide-out-right');

        SearchUIRenderer.renderSuggestions(currentPageSuggestions, this.state.currentIndex, 'search-suggestions');
        SearchUIRenderer.showContainer('search-suggestions');
        container.classList.add('animate-fade-in');

        this._bindSuggestionEvents();
        this._renderPagination();
    }

    _renderPagination() {
        const paginationContainer = document.getElementById('search-pagination');

        if (this.pagination.totalPages <= 1) {
            if (paginationContainer) {
                paginationContainer.classList.add('hidden');
            }
            return;
        }

        SearchUIRenderer.renderPagination(
            this.pagination.currentPage,
            this.pagination.totalPages,
            'search-pagination'
        );

        if (paginationContainer) {
            const suggestionsContainer = document.getElementById('search-suggestions');
            if (suggestionsContainer && !suggestionsContainer.classList.contains('hidden')) {
                const suggestionsRect = suggestionsContainer.getBoundingClientRect();
                const searchArea = suggestionsContainer.parentElement.getBoundingClientRect();
                const topOffset = suggestionsRect.bottom - searchArea.top + 4;
                paginationContainer.style.top = topOffset + 'px';
            }
        }

        this._bindPaginationEvents();
    }

    showDefaultSuggestions() {
        const history = this.state.searchHistory.slice(0, 5);
        const hot = HotSearchManager.getHotSearches(
            this.state.searchFrequency,
            history
        ).slice(0, 3);
        const defaultTags = ['冒险', '恋爱', '悬疑', '校园', '奇幻'];

        SearchUIRenderer.renderDefaultSuggestions(history, hot, defaultTags, 'search-suggestions');

        const container = document.getElementById('search-suggestions');
        if (!container) {
            return;
        }

        container.classList.remove('hidden');
        container.classList.add('animate-fade-in');

        const suggestions = [];
        history.forEach(function(h) {
            suggestions.push({ text: h, type: 'history', score: 90, id: null });
        });
        hot.forEach(function(h) {
            suggestions.push({ text: h, type: 'hot', score: 80, id: null });
        });
        if (suggestions.length === 0) {
            defaultTags.forEach(function(tag) {
                suggestions.push({ text: tag, type: 'tag', score: 70, id: null });
            });
        }

        this.state.suggestions = suggestions;
        this.state.currentIndex = -1;
        this.state.isSelecting = false;

        this._bindDefaultSuggestionEvents();
    }

    _bindSuggestionEvents() {
        const container = document.getElementById('search-suggestions');
        if (!container) {
            return;
        }

        const self = this;
        container.querySelectorAll('.search-suggestion-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                const text = e.currentTarget.dataset.text;
                const id = e.currentTarget.dataset.id;
                const type = e.currentTarget.dataset.type;
                self.selectSuggestion(text, id, type);
            });
        });
    }

    _bindDefaultSuggestionEvents() {
        const container = document.getElementById('search-suggestions');
        if (!container) {
            return;
        }

        const self = this;
        container.querySelectorAll('.search-suggestion-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                if (e.target.classList.contains('history-delete')) {
                    const query = e.target.dataset.query;
                    self._removeFromHistory(query);
                    self.showDefaultSuggestions();
                    return;
                }
                const text = e.currentTarget.dataset.text;
                const type = e.currentTarget.dataset.type;
                self.selectSuggestion(text, null, type);
            });
        });
    }

    _bindPaginationEvents() {
        const paginationContainer = document.getElementById('search-pagination');
        if (!paginationContainer) {
            return;
        }

        const self = this;
        paginationContainer.querySelectorAll('.pagination-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                const direction = e.currentTarget.dataset.direction;
                if (direction === 'prev' && self.pagination.currentPage > 1) {
                    self._changePage('left');
                } else if (direction === 'next' && self.pagination.currentPage < self.pagination.totalPages) {
                    self._changePage('right');
                }
            });
        });
    }

    _changePage(direction) {
        const container = document.getElementById('search-suggestions');
        if (!container) {
            return;
        }

        const itemsContainer = container.querySelector('.suggestions-items-container');
        if (!itemsContainer) {
            return;
        }

        if (direction === 'left') {
            itemsContainer.classList.add('animate-items-slide-right');
        } else {
            itemsContainer.classList.add('animate-items-slide-left');
        }

        const self = this;
        setTimeout(function() {
            if (direction === 'left') {
                self.pagination.previousPage();
            } else {
                self.pagination.nextPage();
            }

            const currentPageSuggestions = self.pagination.getCurrentPageItems(self.state.suggestions);

            self.state.currentIndex = 0;
            self.state.isSelecting = true;

            SearchUIRenderer.renderSuggestions(currentPageSuggestions, self.state.currentIndex, 'search-suggestions');
            self._bindSuggestionEvents();

            itemsContainer.classList.remove('animate-items-slide-left', 'animate-items-slide-right');

            void itemsContainer.offsetWidth;

            if (direction === 'left') {
                itemsContainer.classList.add('animate-items-in-from-left');
            } else {
                itemsContainer.classList.add('animate-items-in-from-right');
            }

            self._renderPagination();

            setTimeout(function() {
                itemsContainer.classList.remove('animate-items-in-from-right', 'animate-items-in-from-left');
            }, 300);
        }, 300);
    }

    handleKeydown(e) {
        const container = document.getElementById('search-suggestions');
        if (!container) {
            return;
        }
        const isVisible = !container.classList.contains('hidden');

        switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            if (!isVisible) {
                return;
            }
            this._moveSelectionDown();
            break;

        case 'ArrowUp':
            e.preventDefault();
            if (!isVisible || !this.state.isSelecting) {
                return;
            }
            this._moveSelectionUp();
            break;

        case 'ArrowLeft':
            if (this.state.isSelecting) {
                e.preventDefault();
                if (!isVisible) {
                    return;
                }
                if (this.pagination.currentPage > 1) {
                    this._changePage('left');
                }
            }
            break;

        case 'ArrowRight':
            if (this.state.isSelecting) {
                e.preventDefault();
                if (!isVisible) {
                    return;
                }
                if (this.pagination.currentPage < this.pagination.totalPages) {
                    this._changePage('right');
                }
            }
            break;

        case 'Enter':
            e.preventDefault();
            this._handleEnter();
            break;

        case 'Escape':
            this.clearSuggestions();
            break;
        }
    }

    _moveSelectionDown() {
        const currentPageSuggestions = this.pagination.getCurrentPageItems(this.state.suggestions);
        if (!this.state.isSelecting) {
            this.state.isSelecting = true;
            this.state.currentIndex = 0;
        } else {
            this.state.currentIndex = Math.min(
                this.state.currentIndex + 1,
                currentPageSuggestions.length - 1
            );
        }
        SearchUIRenderer.updateSelection(this.state.currentIndex);
    }

    _moveSelectionUp() {
        if (this.state.currentIndex === 0) {
            this.state.currentIndex = -1;
            this.state.isSelecting = false;
            const searchInput = document.getElementById('header-search');
            if (searchInput) {
                searchInput.focus();
            }
            SearchUIRenderer.updateSelection(this.state.currentIndex);
        } else {
            this.state.currentIndex = Math.max(this.state.currentIndex - 1, 0);
            SearchUIRenderer.updateSelection(this.state.currentIndex);
        }
    }

    _handleEnter() {
        const currentPageSuggestions = this.pagination.getCurrentPageItems(this.state.suggestions);
        if (this.state.isSelecting &&
            this.state.currentIndex >= 0 &&
            this.state.currentIndex < currentPageSuggestions.length) {
            const selectedItem = currentPageSuggestions[this.state.currentIndex];
            this.selectSuggestion(selectedItem.text, selectedItem.id, selectedItem.type);
        } else {
            const searchInput = document.getElementById('header-search');
            const searchText = searchInput ? searchInput.value.trim() : '';
            if (searchText) {
                this.navigateToSearch(searchText);
            }
        }
    }

    selectSuggestion(text, id, type) {
        const searchInput = document.getElementById('header-search');
        if (searchInput) {
            searchInput.value = text;
        }

        const numId = parseInt(id);
        if ((type === 'game' || type === 'vndb') && !isNaN(numId)) {
            this._saveSearchHistory(text);
            this.navigateToDetail(numId);
        } else {
            this.navigateToSearch(text);
        }

        this.clearSuggestions();
    }

    _saveSearchHistory(query) {
        const result = SearchHistoryManager.addQuery(
            query,
            this.state.searchHistory,
            this.state.searchFrequency
        );

        this.state.searchHistory = result.history;
        this.state.searchFrequency = result.frequency;

        SearchHistoryManager.saveHistory(this.state.searchHistory);
        SearchHistoryManager.saveFrequency(this.state.searchFrequency);

        this.state.hotSearches = HotSearchManager.calculateHotSearches(this.state.searchFrequency);
    }

    _removeFromHistory(query) {
        const result = SearchHistoryManager.removeQuery(
            query,
            this.state.searchHistory,
            this.state.searchFrequency
        );

        this.state.searchHistory = result.history;
        this.state.searchFrequency = result.frequency;

        SearchHistoryManager.saveHistory(this.state.searchHistory);
        SearchHistoryManager.saveFrequency(this.state.searchFrequency);

        this.state.hotSearches = HotSearchManager.calculateHotSearches(this.state.searchFrequency);
    }

    navigateToDetail(id) {
        router.push('detail', { id: id });
    }

    navigateToSearch(text) {
        const searchInput = document.getElementById('header-search');
        if (searchInput) {
            searchInput.blur();
        }

        this._saveSearchHistory(text);
        this.clearSuggestions();

        router.push('search', { q: text });
    }

    syncInputFromURL() {
        const searchInput = document.getElementById('header-search');
        if (!searchInput) {
            return;
        }

        if (document.activeElement !== searchInput) {
            const hash = window.location.hash;
            const queryIndex = hash.indexOf('?');
            if (queryIndex >= 0) {
                const params = new URLSearchParams(hash.slice(queryIndex + 1));
                const q = params.get('q');
                if (q) {
                    searchInput.value = decodeURIComponent(q);
                }
            }
        }
    }

    clearSuggestions() {
        const container = document.getElementById('search-suggestions');
        const paginationContainer = document.getElementById('search-pagination');

        if (!container) {
            return;
        }

        container.classList.add('animate-fade-out');

        if (this.clearTimer) {
            clearTimeout(this.clearTimer);
        }

        const self = this;
        this.clearTimer = setTimeout(function() {
            container.classList.add('hidden');
            container.classList.remove('animate-fade-out');
            container.innerHTML = '';
            if (paginationContainer) {
                paginationContainer.classList.add('hidden');
                paginationContainer.innerHTML = '';
            }
            self.state.suggestions = [];
            self.state.currentIndex = -1;
            self.state.isSelecting = false;
            self.pagination.reset();
            self.state.lastQuery = '';
            self.clearTimer = null;
        }, 300);
    }

    getSuggestions(query) {
        return SuggestionGenerator.generateSuggestions(query);
    }

    saveSearchHistory(query) {
        this._saveSearchHistory(query);
    }
}

export const searchController = new SearchController();
