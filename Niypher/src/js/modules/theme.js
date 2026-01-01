/**
 * 主题管理模块
 * 实现主题切换和管理功能
 */
export const ThemeManager = {
    /**
     * 获取服务器时间并判断当前是白天还是夜晚
     * @returns {string} 主题类型：light 或 dark
     */
    getServerTime() {
        const now = new Date();
        const hour = now.getHours();
        // 6点到18点为白天，其余为夜晚
        return hour >= 6 && hour < 18 ? 'light' : 'dark';
    },
    
    /**
     * 切换主题
     */
    toggleTheme() {
        const body = document.body;
        const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // 切换body的主题类
        body.classList.toggle('dark');
        
        // 更新主题图标
        this.updateThemeIcon(newTheme);
        
        // 保存主题设置
        this.saveTheme(newTheme);
    },
    
    /**
     * 更新主题图标
     * @param {string} theme - 主题类型：light 或 dark
     */
    updateThemeIcon(theme) {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.className = theme === 'light' ? 'ri-moon-line text-xl' : 'ri-sun-line text-xl';
        }
    },
    
    /**
     * 保存主题到localStorage
     * @param {string} theme - 主题类型：light 或 dark
     */
    saveTheme(theme) {
        localStorage.setItem('theme', theme);
    },
    
    /**
     * 从localStorage加载主题
     * @returns {string|null} 保存的主题类型或null
     */
    loadTheme() {
        return localStorage.getItem('theme');
    },
    
    /**
     * 初始化主题
     */
    initTheme() {
        const savedTheme = this.loadTheme();
        const defaultTheme = this.getServerTime();
        const theme = savedTheme || defaultTheme;
        
        if (theme === 'dark') {
            document.body.classList.add('dark');
        }
        this.updateThemeIcon(theme);
    }
};
