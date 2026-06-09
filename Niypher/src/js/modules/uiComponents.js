import { debounce, escapeHtml, showNotification } from './utils.js';
import { CONFIG } from './config.js';
import { router } from './router.js';
import { SearchSuggestion } from './search.js';
import { DB } from './data.js';

export const DeviceDetector = {
    info: null,

    detect: function() {
        const ua = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();
        const dpr = window.devicePixelRatio || 1;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(ua);
        const isTabletUA = /ipad|android(?!.*mobile)|tablet|kindle|silk/i.test(ua);
        const isIOS = /iphone|ipad|ipod/i.test(ua);
        const isAndroid = /android/i.test(ua);
        const isWindows = /win/i.test(platform);
        const isMac = /mac/i.test(platform);
        const isLinux = /linux/i.test(platform);
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const connectionType = connection ? connection.effectiveType : 'unknown';
        const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';
        const physicalWidth = screenWidth / dpr;
        const physicalHeight = screenHeight / dpr;
        const screenDiagonal = Math.sqrt(physicalWidth * physicalWidth + physicalHeight * physicalHeight);

        let deviceType = 'desktop';
        let deviceCategory = 'high-end';

        if (isTabletUA || (isTouch && screenDiagonal >= 7 && screenDiagonal <= 13)) {
            deviceType = 'tablet';
        } else if (isMobileUA || (isTouch && screenDiagonal < 7)) {
            deviceType = 'mobile';
        } else if (isTouch && screenDiagonal > 13) {
            deviceType = 'touch-desktop';
        }

        if (dpr >= 2 && viewportWidth >= 1920) {
            deviceCategory = 'high-end';
        } else if (dpr >= 1.5 && viewportWidth >= 1280) {
            deviceCategory = 'mid-range';
        } else {
            deviceCategory = 'low-end';
        }

        this.info = {
            dpr: dpr,
            screenWidth: screenWidth,
            screenHeight: screenHeight,
            physicalWidth: physicalWidth,
            physicalHeight: physicalHeight,
            screenDiagonal: screenDiagonal,
            viewportWidth: viewportWidth,
            viewportHeight: viewportHeight,
            isTouch: isTouch,
            isMobileUA: isMobileUA,
            isTabletUA: isTabletUA,
            isIOS: isIOS,
            isAndroid: isAndroid,
            isWindows: isWindows,
            isMac: isMac,
            isLinux: isLinux,
            deviceType: deviceType,
            deviceCategory: deviceCategory,
            connectionType: connectionType,
            orientation: orientation,
            ua: ua
        };

        return this.info;
    },

    getEffectiveViewportWidth: function() {
        const dpr = this.info.dpr;
        const viewportWidth = this.info.viewportWidth;
        const deviceType = this.info.deviceType;
        const isTouch = this.info.isTouch;

        let effectiveWidth = viewportWidth;

        if (dpr > 1) {
            const scaleFactor = Math.min(dpr, 2);
            effectiveWidth = viewportWidth / scaleFactor * 1.2;
        }

        if (deviceType === 'mobile') {
            effectiveWidth *= 0.9;
        } else if (deviceType === 'tablet') {
            effectiveWidth *= 0.95;
        }

        if (isTouch && this.info.orientation === 'portrait') {
            effectiveWidth *= 0.85;
        }

        return Math.round(effectiveWidth);
    },

    shouldUseMobileMode: function(availableWidth, threshold = 450) {
        const deviceType = this.info.deviceType;
        const isTouch = this.info.isTouch;
        const dpr = this.info.dpr;
        const orientation = this.info.orientation;

        if (deviceType === 'mobile') {
            return true;
        }

        if (deviceType === 'tablet' && orientation === 'portrait') {
            return availableWidth < threshold * 1.5;
        }

        if (isTouch && dpr >= 2) {
            return availableWidth < threshold * 0.9;
        }

        if (dpr >= 2 && this.info.viewportWidth <= 768) {
            return true;
        }

        return availableWidth < threshold;
    }
};

export const ResponsiveHeader = {
    isMobileMode: false,
    logoBtnWidth: 0,
    leftPadding: CONFIG.UI.LEFT_PADDING,
    rightMinPadding: CONFIG.UI.RIGHT_MIN_PADDING,
    searchMinWidth: CONFIG.UI.SEARCH_MIN_WIDTH,
    searchMaxWidth: CONFIG.UI.SEARCH_MAX_WIDTH,
    minGapWidth: CONFIG.UI.MIN_GAP_WIDTH,

    init: function() {
        DeviceDetector.detect();
        this.updateLayout();
        window.addEventListener('resize', debounce(() => {
            DeviceDetector.detect();
            this.updateLayout();
        }, 100));
        this.initMobileSearch();
    },

    updateLayout: function() {
        const logoContainer = document.getElementById('logo-container');
        const desktopSearch = document.getElementById('desktop-search-container');
        const mobileSearchBtn = document.getElementById('mobile-search-btn');

        if (!logoContainer || !desktopSearch || !mobileSearchBtn) {
            return;
        }

        const logoRect = logoContainer.getBoundingClientRect();
        this.logoBtnWidth = logoRect.width;

        const headerWidth = window.innerWidth;

        const centeredMaxWidth = headerWidth - 2 * (this.leftPadding + this.logoBtnWidth + this.minGapWidth);
        const leftAlignedMaxWidth = headerWidth - this.leftPadding - this.logoBtnWidth - this.minGapWidth - this.rightMinPadding;

        let searchWidth = 0;
        let isCentered = false;
        let canShowSearchBar = false;

        if (centeredMaxWidth >= this.searchMinWidth) {
            searchWidth = Math.min(this.searchMaxWidth, centeredMaxWidth);
            isCentered = true;
            canShowSearchBar = true;
        } else if (leftAlignedMaxWidth >= this.searchMinWidth) {
            searchWidth = this.searchMinWidth;
            isCentered = false;
            canShowSearchBar = true;
        } else {
            canShowSearchBar = false;
        }

        const shouldUseMobileMode = !canShowSearchBar || DeviceDetector.shouldUseMobileMode(leftAlignedMaxWidth, this.searchMinWidth);

        if (shouldUseMobileMode !== this.isMobileMode) {
            this.isMobileMode = shouldUseMobileMode;

            if (shouldUseMobileMode) {
                desktopSearch.classList.add('hidden-mobile');
                desktopSearch.classList.remove('slide-down');
                mobileSearchBtn.classList.remove('mobile-hidden');
                mobileSearchBtn.classList.add('mobile-visible');
            } else {
                desktopSearch.classList.remove('hidden-mobile');
                desktopSearch.classList.add('slide-down');
                mobileSearchBtn.classList.add('mobile-hidden');
                mobileSearchBtn.classList.remove('mobile-visible');

                setTimeout(() => {
                    desktopSearch.classList.remove('slide-down');
                }, 300);
            }
        }

        if (!shouldUseMobileMode && desktopSearch) {
            let leftPosition;

            if (isCentered) {
                const centerPosition = headerWidth / 2;
                leftPosition = centerPosition - (searchWidth / 2);
            } else {
                leftPosition = this.leftPadding + this.logoBtnWidth + this.minGapWidth;
            }

            desktopSearch.style.position = 'absolute';
            desktopSearch.style.left = `${leftPosition}px`;
            desktopSearch.style.top = '50%';
            desktopSearch.style.transform = 'translateY(-50%)';
            desktopSearch.style.maxWidth = `${searchWidth}px`;
            desktopSearch.style.width = `${searchWidth}px`;
            desktopSearch.style.zIndex = '1';
        }
    },

    initMobileSearch: function() {
        const mobileInput = document.getElementById('mobile-search-input');
        const mobileSuggestions = document.getElementById('mobile-search-suggestions');

        if (!mobileInput || !mobileSuggestions) {return;}

        mobileInput.addEventListener('input', debounce((e) => {
            const query = e.target.value.trim();
            this.handleMobileSearch(query);
        }, CONFIG.SEARCH.DEBOUNCE_DELAY));

        mobileInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    MobileSearch.close();
                    SearchSuggestion.saveSearchHistory(query);
                    router.push('search', { q: encodeURIComponent(query) });
                }
            }
        });
    },

    handleMobileSearch: function(query) {
        const mobileSuggestions = document.getElementById('mobile-search-suggestions');

        if (query.length === 0) {
            mobileSuggestions.innerHTML = '';
            return;
        }

        const suggestions = SearchSuggestion.getSuggestions(query);
        this.displayMobileSuggestions(suggestions);
    },

    displayMobileSuggestions: function(suggestions) {
        const container = document.getElementById('mobile-search-suggestions');

        if (suggestions.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-400 py-8">未找到相关结果</div>';
            return;
        }

        const iconMap = {
            'game': 'ri-gamepad-2-line',
            'tag': 'ri-hash',
            'developer': 'ri-building-4-line',
            'vndb': 'ri-database-2-line'
        };

        const html = suggestions.slice(0, 10).map(item => `
            <div class="mobile-search-item" data-id="${escapeHtml(String(item.id))}" data-type="${escapeHtml(item.type)}" data-text="${escapeHtml(item.text)}">
                <i class="${iconMap[item.type] || 'ri-search-line'} text-gray-500 dark:text-gray-400"></i>
                <span class="flex-1">${escapeHtml(item.text)}</span>
                <span class="text-xs text-gray-400">${item.type === 'game' ? '游戏' : item.type === 'tag' ? '标签' : item.type === 'developer' ? '开发商' : 'VNDB'}</span>
            </div>
        `).join('');

        container.innerHTML = html;

        container.querySelectorAll('.mobile-search-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                const type = item.dataset.type;
                const text = item.dataset.text;

                SearchSuggestion.saveSearchHistory(text);
                MobileSearch.close();

                if ((type === 'game' || type === 'vndb') && id) {
                    router.push('detail', { id: parseInt(id) });
                } else {
                    router.push('search', { q: encodeURIComponent(text) });
                }
            });
        });
    }
};

export const MobileSearch = {
    isOpen: false,

    open: function() {
        const overlay = document.getElementById('mobile-search-overlay');
        const input = document.getElementById('mobile-search-input');

        if (!overlay) {return;}

        overlay.classList.add('show');
        this.isOpen = true;

        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    },

    close: function() {
        const overlay = document.getElementById('mobile-search-overlay');
        const input = document.getElementById('mobile-search-input');
        const suggestions = document.getElementById('mobile-search-suggestions');

        if (!overlay) {return;}

        overlay.classList.remove('show');
        this.isOpen = false;

        if (input) {
            input.value = '';
        }

        if (suggestions) {
            suggestions.innerHTML = '';
        }
    }
};

export const LogoMenu = {
    isOpen: false,

    toggle: function() {
        const menu = document.getElementById('logo-menu');
        const arrow = document.getElementById('logo-menu-arrow');

        if (this.isOpen) {
            menu.classList.remove('show');
            arrow.classList.remove('rotated');
        } else {
            menu.classList.add('show');
            arrow.classList.add('rotated');
        }
        this.isOpen = !this.isOpen;
    },

    close: function() {
        if (this.isOpen) {
            const menu = document.getElementById('logo-menu');
            const arrow = document.getElementById('logo-menu-arrow');
            menu.classList.remove('show');
            arrow.classList.remove('rotated');
            this.isOpen = false;
        }
    },

    goHome: function() {
        this.close();
        router.push('home');
    },

    randomGame: function() {
        this.close();
        if (DB.resources && DB.resources.length > 0) {
            const randomIndex = Math.floor(Math.random() * DB.resources.length);
            const randomGame = DB.resources[randomIndex];
            router.push('detail', { id: randomGame.id });
        } else {
            showNotification('暂无游戏数据', 'warning');
        }
    },

    openHelp: function() {
        this.close();
        showNotification('帮助文档功能开发中', 'info');
    },

    openCommunity: function() {
        this.close();
        showNotification('官方社群功能开发中', 'info');
    },

    openFeedback: function() {
        this.close();
        showNotification('帮助反馈功能开发中', 'info');
    }
};

export function initLogoMenuClickHandler() {
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('logo-menu');
        const button = e.target.closest('.glass-card-pill');

        if (LogoMenu.isOpen && !menu.contains(e.target) && !button) {
            LogoMenu.close();
        }
    });
}
