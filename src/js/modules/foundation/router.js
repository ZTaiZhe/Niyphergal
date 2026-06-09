import { render } from '../search/renderer.js';
import { updateNav } from '../ui/navigation.js';
import { showAnnouncement, closeAnnouncement } from '../ui/announcement.js';
import { bindPasswordCheck } from './authForm.js';
import { Actions } from './auth.js';
import { RouterStore } from './store.js';

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

function _getScrollY() {
    let mc = document.getElementById('main-container');
    if (mc && mc.scrollTop > 0) return mc.scrollTop;
    return window.scrollY;
}

function _scrollTo(y) {
    let mc = document.getElementById('main-container');
    if (mc) mc.scrollTop = y;
    window.scrollTo(0, y);
}

export const router = {
    get current() { return RouterStore.getState().current; },
    get previous() { return RouterStore.getState().previous; },
    get params() { return RouterStore.getState().params; },
    get scrollPositions() { return RouterStore.getState().scrollPositions || {}; },
    get lastSearchParams() { return RouterStore.getState().lastSearchParams || {}; },

    push(page, params = {}) {
        const state = RouterStore.getState();
        const scrollPositions = { ...state.scrollPositions };
        scrollPositions[state.current] = _getScrollY();

        RouterStore.setState({
            previous: state.current,
            current: page,
            params: params,
            scrollPositions: scrollPositions
        });

        this._updateURL('push');
        render(this, 'push');
        updateNav(this);
        let savedY = scrollPositions[page];
        if (savedY !== undefined && savedY !== null) {
            let updatedPositions = { ...RouterStore.getState().scrollPositions };
            delete updatedPositions[page];
            RouterStore.setState({ scrollPositions: updatedPositions });
            _scrollTo(savedY);
        } else {
            _scrollTo(0);
        }
    },

    replace(page, params = {}) {
        const state = RouterStore.getState();
        RouterStore.setState({
            previous: state.current,
            current: page,
            params: params
        });

        this._updateURL('replace');
        render(this, 'replace');
        updateNav(this);
    },

    pushSearch(params = {}) {
        const state = RouterStore.getState();
        const isCoreChange = params.q !== state.lastSearchParams?.q;
        const isFilterChange = params.sort !== state.lastSearchParams?.sort ||
                               params.order !== state.lastSearchParams?.order ||
                               params.filter !== state.lastSearchParams?.filter;

        const scrollPositions = { ...state.scrollPositions };
        scrollPositions[state.current] = _getScrollY();

        RouterStore.setState({
            previous: state.current,
            current: 'search',
            params: params,
            scrollPositions: scrollPositions
        });

        if (isCoreChange) {
            this._updateURL('push');
            render(this, 'push');
        } else {
            this._updateURL('replace');
            render(this, 'replace');
        }

        RouterStore.setState({ lastSearchParams: { ...params } });
        updateNav(this);

        if (isCoreChange) {
            _scrollTo(0);
        }
    },

    replaceSearch(params = {}) {
        const state = RouterStore.getState();
        RouterStore.setState({
            previous: state.current,
            current: 'search',
            params: params,
            lastSearchParams: { ...params }
        });

        this._updateURL('replace');
        render(this, 'replace');
        updateNav(this);
    },

    _updateURL(mode) {
        const state = RouterStore.getState();
        let url = `#${state.current}`;
        const searchParams = new URLSearchParams();

        if (state.params.q) {searchParams.set('q', state.params.q);}
        if (state.params.sort) {searchParams.set('sort', state.params.sort);}
        if (state.params.order) {searchParams.set('order', state.params.order);}
        if (state.params.filter) {searchParams.set('filter', state.params.filter);}
        if (state.params.id) searchParams.set('id', state.params.id);
        if (state.params.page) {searchParams.set('page', state.params.page);}

        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        const stateData = {
            page: state.current,
            params: state.params,
            scrollY: _getScrollY()
        };

        if (mode === 'push') {
            history.pushState(stateData, '', url);
        } else {
            history.replaceState(stateData, '', url);
        }
    },

    getParams() {
        return { ...RouterStore.getState().params };
    },

    setParam(key, value, mode = 'replace') {
        const params = { ...RouterStore.getState().params };
        params[key] = value;
        RouterStore.setState({ params });
        this._updateURL(mode);
    }
};

export { showAnnouncement, closeAnnouncement, bindPasswordCheck, updateNav };

window.addEventListener('popstate', (event) => {
    const state = RouterStore.getState();
    if (event.state) {
        RouterStore.setState({
            previous: state.current,
            current: event.state.page,
            params: event.state.params || {}
        });

        if (event.state.page === 'search') {
            RouterStore.setState({ lastSearchParams: { ...event.state.params } });
        }

        render(router, 'pop');
        updateNav(router);

        if (event.state.scrollY !== undefined && event.state.scrollY !== null) {
            requestAnimationFrame(() => {
                _scrollTo(event.state.scrollY);
            });
        } else {
            _scrollTo(0);
        }
    } else {
        RouterStore.setState({
            previous: state.current,
            current: 'home',
            params: {}
        });
        render(router, 'pop');
        updateNav(router);
        _scrollTo(0);
    }
});
