import { showNotification } from './utils.js';
import { secureSetItem, secureGetItem, secureRemoveItem, clearKeyCache, setSessionPassword, hasSessionPassword, clearSessionPassword } from './crypto.js';
import { DB } from './data.js';

const createStore = (initialState) => {
    let state = { ...initialState };
    const listeners = new Set();

    return {
        getState: () => ({ ...state }),

        setState: function(newState) {
            const prevState = { ...state };
            if (typeof newState === 'function') {
                state = { ...state, ...newState(state) };
            } else {
                state = { ...state, ...newState };
            }
            listeners.forEach(listener => listener(state, prevState));
        },

        subscribe: (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },

        reset: function() {
            state = { ...initialState };
            listeners.forEach(listener => listener(state, initialState));
        }
    };
};

export const UserStore = createStore({
    user: null,
    registeredUsers: [],
    isLoggedIn: false
});

export const AuthStore = createStore({
    step: 1,
    email: '',
    isRegistered: false,
    humanVerified: false,
    turnstileToken: null,
    turnstileWidgetId: null
});

export const RouterStore = createStore({
    current: 'home',
    previous: 'home',
    params: {},
    history: ['home'],
    scrollPositions: {},
    lastSearchParams: {}
});

export const ThemeStore = createStore({
    theme: 'light',
    systemPreference: 'light'
});

export const UIStore = createStore({
    announcementShown: false,
    menuOpen: false,
    searchOpen: false,
    loading: false
});

export const authFlowState = {
    get step() { return AuthStore.getState().step; },
    set step(value) { AuthStore.setState({ step: value }); },
    get email() { return AuthStore.getState().email; },
    set email(value) { AuthStore.setState({ email: value }); },
    get isRegistered() { return AuthStore.getState().isRegistered; },
    set isRegistered(value) { AuthStore.setState({ isRegistered: value }); },
    get humanVerified() { return AuthStore.getState().humanVerified; },
    set humanVerified(value) { AuthStore.setState({ humanVerified: value }); },
    get turnstileToken() { return AuthStore.getState().turnstileToken; },
    set turnstileToken(value) { AuthStore.setState({ turnstileToken: value }); },
    get turnstileWidgetId() { return AuthStore.getState().turnstileWidgetId; },
    set turnstileWidgetId(value) { AuthStore.setState({ turnstileWidgetId: value }); }
};

export const Store = {
    user: UserStore,
    auth: AuthStore,
    router: RouterStore,
    theme: ThemeStore,
    ui: UIStore,

    init: async function() {
        await this.loadPersistedState();
    },

    loadPersistedState: async function() {
        try {
            const rawUserData = localStorage.getItem('niypher_user');
            if (rawUserData && !rawUserData.startsWith('ENCv2:')) {
                try {
                    const userData = JSON.parse(rawUserData);
                    if (userData) {
                        this.user.setState({
                            user: userData,
                            isLoggedIn: true
                        });
                        DB.user = userData;
                    }
                } catch (e) {
                    console.warn('解析未加密用户数据失败:', e);
                }
            }

            const savedTheme = localStorage.getItem('niypher_theme');
            if (savedTheme) {
                this.theme.setState({ theme: savedTheme });
            }

            const rawRegisteredUsers = localStorage.getItem('niypher_registered_users');
            if (rawRegisteredUsers && !rawRegisteredUsers.startsWith('ENCv2:')) {
                try {
                    const registeredUsers = JSON.parse(rawRegisteredUsers);
                    if (registeredUsers) {
                        this.user.setState({
                            registeredUsers: registeredUsers
                        });
                        DB.registeredUsers = registeredUsers;
                    }
                } catch (e) {
                    console.warn('解析未加密注册用户数据失败:', e);
                }
            }
        } catch (e) {
            console.error('加载持久化状态失败:', e);
        }
    },

    persistUser: async function() {
        const { user, isLoggedIn } = this.user.getState();
        if (isLoggedIn && user) {
            await secureSetItem('niypher_user', user);
        } else {
            secureRemoveItem('niypher_user');
        }
    },

    persistTheme: function() {
        const { theme } = this.theme.getState();
        localStorage.setItem('niypher_theme', theme);
    },

    persistRegisteredUsers: async function() {
        const { registeredUsers } = this.user.getState();
        await secureSetItem('niypher_registered_users', registeredUsers);
    },

    login: async function(userData, password = null) {
        if (password) {
            setSessionPassword(password);
        }
        this.user.setState({
            user: userData,
            isLoggedIn: true
        });
        await this.persistUser();
        showNotification('登录成功', 'success');
    },

    logout: function() {
        this.user.setState({
            user: null,
            isLoggedIn: false
        });
        this.auth.reset();
        secureRemoveItem('niypher_user');
        clearSessionPassword();
        showNotification('已退出登录', 'info');
    },

    register: async function(userData, password = null) {
        const { registeredUsers } = this.user.getState();
        this.user.setState({
            registeredUsers: [...registeredUsers, userData]
        });
        await this.persistRegisteredUsers();
        if (password) {
            setSessionPassword(password);
        }
    },

    navigate: function(page, params = {}) {
        const { current } = this.router.getState();
        this.router.setState({
            previous: current,
            current: page,
            params: params,
            history: [...this.router.getState().history, page]
        });
    },

    goBack: function() {
        const { history } = this.router.getState();
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop();
            const previousPage = newHistory[newHistory.length - 1];
            this.router.setState({
                current: previousPage,
                previous: history[history.length - 1],
                history: newHistory
            });
        }
    },

    setTheme: function(theme) {
        this.theme.setState({ theme });
        this.persistTheme();
    },

    toggleTheme: function() {
        const { theme } = this.theme.getState();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    showAnnouncement: function() {
        this.ui.setState({ announcementShown: true });
    },

    hideAnnouncement: function() {
        this.ui.setState({ announcementShown: false });
    },

    setAuthStep: function(step) {
        this.auth.setState({ step });
    },

    setAuthEmail: function(email) {
        this.auth.setState({ email });
    },

    setAuthRegistered: function(isRegistered) {
        this.auth.setState({ isRegistered });
    },

    setTurnstileToken: function(token, widgetId) {
        this.auth.setState({
            turnstileToken: token,
            turnstileWidgetId: widgetId,
            humanVerified: !!token
        });
    },

    resetAuth: function() {
        this.auth.reset();
    }
};

export default Store;
