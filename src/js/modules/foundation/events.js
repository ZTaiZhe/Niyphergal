// Global data-action event handler
import { router } from './router.js';
import { getHeroExitContext, performHeroExit } from '../ui/animationHelpers.js';
import { LogoMenu, MobileSearch } from '../ui/uiComponents.js';
import { ThemeManager } from './theme.js';
import { retryLastSearch } from '../search/renderer.js';

export function initGlobalEvents() {
    document.addEventListener("click", (e) => {
        const action = e.target.closest("[data-action]")?.dataset.action;
        if (!action) return;

        switch (action) {
        case "logo-menu-toggle":
            if (document.body.classList.contains("is-detail-page")) {
                LogoMenu.close();
                var ctx = getHeroExitContext();
                if (ctx) { performHeroExit(router); }
                else { router.push("home"); }
            } else { LogoMenu.toggle(); }
            break;
        case "logo-menu-home": LogoMenu.goHome(); break;
        case "logo-menu-random": LogoMenu.randomGame(); break;
        case "logo-menu-help": LogoMenu.openHelp(); break;
        case "logo-menu-community": LogoMenu.openCommunity(); break;
        case "logo-menu-feedback": LogoMenu.openFeedback(); break;
        case "mobile-search-open": MobileSearch.open(); break;
        case "mobile-search-close": MobileSearch.close(); break;
        case "toggle-theme": ThemeManager.toggleTheme(); break;
        case "nav-category": router.push("category"); break;
        case "nav-galgame": router.push("galgame"); break;
        case "nav-profile": router.push("profile"); break;
        case "search-back-home": router.push("home"); break;
        case "navigate-home":
            var ctx = getHeroExitContext();
            if (ctx) { performHeroExit(router); }
            else { router.push("home"); }
            break;
        case "search-retry":
            if (typeof retryLastSearch === "function") retryLastSearch();
            break;
        case "search-reload": window.location.reload(); break;
        }

        const menu = document.getElementById("logo-menu");
        const button = e.target.closest("#logo-container button");
        if (LogoMenu.isOpen && !menu.contains(e.target) && !button) {
            LogoMenu.close();
        }
    });
}