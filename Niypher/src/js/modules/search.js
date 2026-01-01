/**
 * 搜索联想功能模块
 * 实现搜索建议的生成、显示和交互
 */
import { debounce } from './utils.js';
import { DB } from './data.js';

export const SearchSuggestion = {
    // 搜索建议相关状态
    suggestions: [],
    currentIndex: -1,
    isSelecting: false,
    searchCache: new Map(), // 搜索结果缓存
    
    /**
     * 初始化搜索建议功能
     */
    init: function() {
        const searchInput = document.getElementById('header-search');
        const suggestionContainer = document.getElementById('search-suggestions');
        
        if (!searchInput || !suggestionContainer) return;
        
        // 输入事件监听，添加防抖
        searchInput.addEventListener('input', debounce((e) => {
            const query = e.target.value.trim();
            this.handleInput(query);
        }, 300));
        
        // 键盘事件监听
        searchInput.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
        
        // 点击外部关闭搜索建议
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.relative.w-full.max-w-2xl.mx-auto')) {
                this.clearSuggestions();
            }
        });
    },
    
    /**
     * 处理输入事件
     * @param {string} query - 搜索查询
     */
    handleInput: function(query) {
        if (query.length === 0) {
            this.clearSuggestions();
            return;
        }
        
        // 检查缓存
        if (this.searchCache.has(query)) {
            const cachedSuggestions = this.searchCache.get(query);
            this.displaySuggestions(cachedSuggestions);
            return;
        }
        
        const suggestions = this.getSuggestions(query);
        
        // 缓存结果
        this.searchCache.set(query, suggestions);
        
        this.displaySuggestions(suggestions);
    },
    
    /**
     * 获取搜索建议
     * @param {string} query - 搜索查询
     * @returns {Array} 搜索建议数组
     */
    getSuggestions: function(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        // 遍历所有游戏资源
        DB.resources.forEach(resource => {
            const title = resource.title;
            const lowerTitle = title.toLowerCase();
            
            // 匹配游戏名称
            if (lowerTitle.includes(lowerQuery)) {
                results.push({
                    text: title,
                    type: 'game',
                    score: this.calculateScore(lowerTitle, lowerQuery),
                    id: resource.id
                });
            }
            
            // 匹配游戏标签
            resource.tags.forEach(tag => {
                const lowerTag = tag.toLowerCase();
                if (lowerTag.includes(lowerQuery)) {
                    results.push({
                        text: tag,
                        type: 'tag',
                        score: this.calculateScore(lowerTag, lowerQuery)
                    });
                }
            });
        });
        
        // 去重
        const uniqueResults = this.removeDuplicates(results);
        
        // 按分数排序
        uniqueResults.sort((a, b) => b.score - a.score);
        
        // 返回前10个结果
        return uniqueResults.slice(0, 10);
    },
    
    /**
     * 计算匹配分数
     * @param {string} text - 文本
     * @param {string} query - 查询
     * @returns {number} 匹配分数
     */
    calculateScore: function(text, query) {
        // 简单的分数计算：完全匹配 > 开头匹配 > 包含匹配
        if (text === query) return 100;
        if (text.startsWith(query)) return 80;
        if (text.includes(query)) return 60;
        return 0;
    },
    
    /**
     * 去重
     * @param {Array} results - 结果数组
     * @returns {Array} 去重后的结果数组
     */
    removeDuplicates: function(results) {
        const seen = new Set();
        return results.filter(item => {
            const key = `${item.text}-${item.type}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    },
    
    /**
     * 显示搜索建议
     * @param {Array} suggestions - 搜索建议数组
     */
    displaySuggestions: function(suggestions) {
        const container = document.getElementById('search-suggestions');
        
        if (suggestions.length === 0) {
            container.classList.add('hidden');
            return;
        }
        
        this.suggestions = suggestions;
        this.currentIndex = -1;
        this.isSelecting = false;
        
        // 渲染搜索建议
        container.innerHTML = suggestions.map((item, index) => `
            <div class="search-suggestion-item flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors ${index === this.currentIndex ? 'bg-pink-50 dark:bg-pink-900/30 font-medium' : ''}" data-index="${index}" data-text="${item.text}">
                <i class="ri-${item.type === 'game' ? 'gamepad-2' : 'hash'}-line text-gray-500 dark:text-gray-400 mr-2"></i>
                <span>${item.text}</span>
            </div>
        `).join('');
        
        // 添加点击事件
        container.querySelectorAll('.search-suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const text = e.currentTarget.dataset.text;
                this.selectSuggestion(text);
            });
        });
        
        container.classList.remove('hidden');
    },
    
    /**
     * 处理键盘事件
     * @param {KeyboardEvent} e - 键盘事件
     */
    handleKeydown: function(e) {
        const container = document.getElementById('search-suggestions');
        const isVisible = !container.classList.contains('hidden');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!isVisible) return;
                
                if (!this.isSelecting) {
                    this.isSelecting = true;
                    this.currentIndex = 0;
                } else {
                    this.currentIndex = Math.min(this.currentIndex + 1, this.suggestions.length - 1);
                }
                this.updateSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (!isVisible || !this.isSelecting) return;
                
                if (this.currentIndex === 0) {
                    // 第一项按上键返回输入框
                    this.currentIndex = -1;
                    this.isSelecting = false;
                    document.getElementById('header-search').focus();
                    this.updateSelection();
                } else {
                    this.currentIndex = Math.max(this.currentIndex - 1, 0);
                    this.updateSelection();
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.isSelecting && this.currentIndex >= 0 && this.currentIndex < this.suggestions.length) {
                    // 选中了建议项
                    const selectedText = this.suggestions[this.currentIndex].text;
                    this.selectSuggestion(selectedText);
                } else {
                    // 搜索当前输入
                    const searchText = document.getElementById('header-search').value;
                    this.performSearch(searchText);
                }
                break;
                
            case 'Escape':
                this.clearSuggestions();
                break;
        }
    },
    
    /**
     * 更新选中状态
     */
    updateSelection: function() {
        const items = document.querySelectorAll('.search-suggestion-item');
        const suggestionContainer = document.getElementById('search-suggestions');
        
        if (!items.length) return;
        
        items.forEach((item, index) => {
            if (index === this.currentIndex) {
                item.classList.add('bg-pink-50', 'dark:bg-pink-900/30', 'font-medium');
                
                // 计算并设置竖条位置
                const rect = item.getBoundingClientRect();
                const containerRect = suggestionContainer.getBoundingClientRect();
                const top = rect.top - containerRect.top + rect.height / 2;
                
                // 直接修改样式，实现平滑平移
                suggestionContainer.style.setProperty('--bar-top', `${top}px`);
                
                // 添加选中项类，展开竖条
                suggestionContainer.classList.add('has-selected-item');
            } else {
                item.classList.remove('bg-pink-50', 'dark:bg-pink-900/30', 'font-medium');
            }
        });
        
        // 当没有选中项时，执行消失逻辑
        if (this.currentIndex === -1) {
            // 移除所有选中状态
            items.forEach(item => {
                item.classList.remove('bg-pink-50', 'dark:bg-pink-900/30', 'font-medium');
            });
            
            // 移除选中项类，收缩竖条
            suggestionContainer.classList.remove('has-selected-item');
            
            // 重置CSS变量
            suggestionContainer.style.removeProperty('--bar-top');
        }
    },
    
    /**
     * 选择搜索建议
     * @param {string} text - 选中的建议文本
     */
    selectSuggestion: function(text) {
        const searchInput = document.getElementById('header-search');
        searchInput.value = text;
        this.performSearch(text);
        this.clearSuggestions();
    },
    
    /**
     * 执行搜索
     * @param {string} text - 搜索文本
     */
    performSearch: function(text) {
        alert(`正在搜索: ${text}`);
        // 实际应用中这里会调用搜索API
    },
    
    /**
     * 清除搜索建议
     */
    clearSuggestions: function() {
        const container = document.getElementById('search-suggestions');
        container.classList.add('hidden');
        container.innerHTML = '';
        this.suggestions = [];
        this.currentIndex = -1;
        this.isSelecting = false;
    }
};
