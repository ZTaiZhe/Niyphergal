import { Actions } from './auth.js';
import { router, showAnnouncement, closeAnnouncement, bindPasswordCheck, updateNav } from './router.js';
import { render } from './renderer.js';
import { authFlowState } from './store.js';
import { showNotification } from './utils.js';
import { ThemeManager } from './theme.js';
import { LogoMenu, MobileSearch } from './uiComponents.js';
import { bindAuthStepEvents } from './authForm.js';

export const Globals = {
    Actions,
    router,
    showAnnouncement,
    closeAnnouncement,
    bindPasswordCheck,
    updateNav,
    authFlowState,
    showNotification,
    LogoMenu,
    ThemeManager,
    MobileSearch,
    bindAuthStepEvents,
    render
};

export function initGlobals() {
    if (typeof window !== 'undefined') {
        window.Actions = Actions;
        window.router = router;
        window.showAnnouncement = showAnnouncement;
        window.closeAnnouncement = closeAnnouncement;
        window.bindPasswordCheck = bindPasswordCheck;
        window.updateNav = updateNav;
        window.authFlowState = authFlowState;
        window.showNotification = showNotification;
        window.LogoMenu = LogoMenu;
        window.ThemeManager = ThemeManager;
        window.MobileSearch = MobileSearch;
        window.bindAuthStepEvents = bindAuthStepEvents;
        window.render = render;
    }
}

export default Globals;
