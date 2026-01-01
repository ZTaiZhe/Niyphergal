/**
 * 主应用入口
 * 整合所有模块，初始化应用
 */

// 导入模块
import { ImagePreloader } from './modules/data.js';
import { SearchSuggestion } from './modules/search.js';
import { ThemeManager } from './modules/theme.js';
import { router, updateNav, showAnnouncement, closeAnnouncement, bindPasswordCheck, Actions } from './modules/router.js';

/**
 * 初始化应用
 */
function initApp() {
    // 先初始化主题，再加载页面，最后更新导航
    ThemeManager.initTheme();
    
    // 初始化路由
    router.push('home');
    
    // 确保导航在主题初始化后更新，特别是在深色模式下
    updateNav();
    
    // 初始化搜索联想功能
    SearchSuggestion.init();
    
    // 初始化图片预加载
    ImagePreloader.init();
    
    // 监听主容器的变化，为动态生成的搜索框添加事件
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) {
        const observer = new MutationObserver(() => {
            // 为引力搜索框添加回车键事件
            const galSearch = document.getElementById('gal-search');
            if (galSearch && !galSearch.hasAttribute('data-event-bound')) {
                galSearch.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        alert('正在调用后端搜索接口...');
                    }
                });
                galSearch.setAttribute('data-event-bound', 'true');
            }
        });
        
        observer.observe(mainContainer, { childList: true, subtree: true });
    }
}

// 导出全局函数，供HTML使用
window.router = router;
window.Actions = Actions;
window.closeAnnouncement = closeAnnouncement;
window.ThemeManager = ThemeManager;

// 页面加载完成后初始化应用
window.addEventListener('load', initApp);
