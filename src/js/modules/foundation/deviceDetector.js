function DeviceDetector() {
    var _state = {
        isMobile: false,
        isDesktop: true,
        isTablet: false,
        previousState: { isMobile: false, isDesktop: true, isTablet: false }
    };
    var _deviceInfo = { ua: null, touch: null, screenSize: null, hardware: null, tablet: null };
    var _self = this;

    Object.defineProperties(this, {
        isMobile: {
            get: function() { return _state.isMobile; },
            enumerable: false, configurable: true
        },
        isDesktop: {
            get: function() { return _state.isDesktop; },
            enumerable: false, configurable: true
        },
        isTablet: {
            get: function() { return _state.isTablet; },
            enumerable: false, configurable: true
        },
        deviceInfo: {
            get: function() { return _deviceInfo; },
            enumerable: false, configurable: true
        }
    });

    this._checkUA = function() {
        return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    this._checkTouch = function() {
        return window.matchMedia('(pointer: coarse)').matches;
    };

    this._checkScreenSize = function() {
        return window.matchMedia('(max-width: 768px)').matches;
    };

    this._checkHardware = function() {
        return (
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
            (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
            (screen.width <= 768 || screen.height <= 768) ||
            ('ontouchstart' in window)
        );
    };

    this._checkTablet = function() {
        return window.matchMedia('(min-width: 481px) and (max-width: 1024px)').matches;
    };

    this._evaluate = function() {
        var uaR = _self._checkUA();
        var touchR = _self._checkTouch();
        var screenR = _self._checkScreenSize();
        var hwR = _self._checkHardware();
        var tabletR = _self._checkTablet();

        _deviceInfo.ua = uaR;
        _deviceInfo.touch = touchR;
        _deviceInfo.screenSize = screenR;
        _deviceInfo.hardware = hwR;
        _deviceInfo.tablet = tabletR;

        var votes = (uaR ? 1 : 0) + (touchR ? 1 : 0) + (screenR ? 1 : 0) + (hwR ? 1 : 0);

        _state.isMobile = votes >= 3;
        _state.isTablet = tabletR;
        _state.isDesktop = !_state.isMobile && !_state.isTablet;
    };

    this._dispatchIfChanged = function() {
        var prev = _state.previousState;
        if (prev.isMobile !== _state.isMobile ||
            prev.isDesktop !== _state.isDesktop ||
            prev.isTablet !== _state.isTablet) {

            prev.isMobile = _state.isMobile;
            prev.isDesktop = _state.isDesktop;
            prev.isTablet = _state.isTablet;

            var event = new CustomEvent('device:changed', {
                detail: {
                    isMobile: _state.isMobile,
                    isDesktop: _state.isDesktop,
                    isTablet: _state.isTablet,
                    deviceInfo: _deviceInfo
                }
            });
            window.dispatchEvent(event);
        }
    };

    this._onChange = function() {
        _self._evaluate();
        _self._dispatchIfChanged();
    };

    var _mediaQuery768 = null;
    var _resizeBound = null;
    var _mediaQueryChangeBound = null;

    this.init = function() {
        _self._evaluate();
        _state.previousState.isMobile = _state.isMobile;
        _state.previousState.isDesktop = _state.isDesktop;
        _state.previousState.isTablet = _state.isTablet;

        if (typeof window !== 'undefined') {
            if (!window.__NPHER_V2) {
                window.__NPHER_V2 = {};
            }
            window.__NPHER_V2.deviceDetector = _self;
        }

        _resizeBound = function() { _self._onChange(); };
        window.addEventListener('resize', _resizeBound);

        _mediaQuery768 = window.matchMedia('(max-width: 768px)');
        _mediaQueryChangeBound = function() { _self._onChange(); };
        if (_mediaQuery768.addEventListener) {
            _mediaQuery768.addEventListener('change', _mediaQueryChangeBound);
        } else if (_mediaQuery768.addListener) {
            _mediaQuery768.addListener(_mediaQueryChangeBound);
        }
    };

    this.destroy = function() {
        if (_resizeBound) {
            window.removeEventListener('resize', _resizeBound);
            _resizeBound = null;
        }
        if (_mediaQuery768) {
            if (_mediaQuery768.removeEventListener) {
                _mediaQuery768.removeEventListener('change', _mediaQueryChangeBound);
            } else if (_mediaQuery768.removeListener) {
                _mediaQuery768.removeListener(_mediaQueryChangeBound);
            }
            _mediaQuery768 = null;
        }
        _mediaQueryChangeBound = null;
    };
}

export var deviceDetector = new DeviceDetector();

export { DeviceDetector };
export default deviceDetector;
