export const ThemeManager = {
    _timeCheckInterval: null,

    getTimezoneInfo() {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offset = new Date().getTimezoneOffset();
        return {
            timezone: timezone,
            offset: offset,
            offsetHours: -offset / 60
        };
    },

    getLocalTimeTheme() {
        const now = new Date();
        const hour = now.getHours();
        return hour >= 6 && hour < 18 ? 'light' : 'dark';
    },

    toggleTheme() {
        const body = document.body;
        const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        body.classList.toggle('dark');

        this.updateThemeIcon(newTheme);

        this.saveTheme(newTheme);

        const turnstileContainer = document.getElementById('turnstile-container');
        if (turnstileContainer && !turnstileContainer.classList.contains('hidden')) {
            import('./auth.js').then(({ Actions }) => {
                if (Actions && Actions.initTurnstile) {
                    Actions.initTurnstile();
                }
            });
        }
    },

    updateThemeIcon(theme) {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.className = theme === 'light' ? 'ri-moon-line text-xl' : 'ri-sun-line text-xl';
        }
    },

    saveTheme(theme) {
        localStorage.setItem('niypher_theme', theme);
    },

    loadTheme() {
        return localStorage.getItem('niypher_theme');
    },

    shouldAutoSwitch() {
        return !this.loadTheme();
    },

    checkAndSwitchTheme() {
        if (!this.shouldAutoSwitch()) {return;}

        const expectedTheme = this.getLocalTimeTheme();
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';

        if (expectedTheme !== currentTheme) {
            document.body.classList.toggle('dark');
            this.updateThemeIcon(expectedTheme);
        }
    },

    startAutoThemeSwitch() {
        this.checkAndSwitchTheme();

        if (this._timeCheckInterval) {
            clearInterval(this._timeCheckInterval);
        }

        this._timeCheckInterval = setInterval(() => {
            this.checkAndSwitchTheme();
        }, 60000);
    },

    stopAutoThemeSwitch() {
        if (this._timeCheckInterval) {
            clearInterval(this._timeCheckInterval);
            this._timeCheckInterval = null;
        }
    },

    initTheme() {
        const savedTheme = this.loadTheme();
        const defaultTheme = this.getLocalTimeTheme();
        const theme = savedTheme || defaultTheme;

        if (theme === 'dark') {
            document.body.classList.add('dark');
        }
        this.updateThemeIcon(theme);
        this.startAutoThemeSwitch();
    }
};
