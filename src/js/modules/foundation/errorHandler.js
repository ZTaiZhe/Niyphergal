import { showNotification } from './utils.js';
import { CONFIG } from './config.js';

export const ErrorHandler = {
    initialized: false,

    init: function() {
        if (this.initialized) {return;}

        window.onerror = this.handleGlobalError.bind(this);

        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));

        this.initialized = true;
    },

    handleGlobalError: function(message, source, lineno, colno, error) {
        // Ignore benign ResizeObserver loop error (Chrome behavior, not a real error)
        if (typeof message === 'string' && message.includes('ResizeObserver loop')) {
            return true;
        }

        this.logError('Global Error', {
            message: message,
            source: source,
            line: lineno,
            column: colno,
            error: error
        });

        showNotification('发生错误请刷新页面重试', 'error');

        return false;
    },

    handlePromiseRejection: function(event) {
        this.logError('Unhandled Promise Rejection', {
            reason: event.reason
        });

        showNotification('操作失败请稍后重试', 'error');

        event.preventDefault();
    },

    logError: function(type, details) {
        const errorInfo = {
            type: type,
            timestamp: new Date().toISOString(),
            app: CONFIG.APP.NAME,
            version: CONFIG.APP.VERSION,
            userAgent: navigator.userAgent,
            url: window.location.href,
            details: details
        };

        console.error('[ErrorHandler]', errorInfo);
    },

    wrapFunction: function(fn, context) {
        const self = this;
        return function(...args) {
            try {
                return fn.apply(context || this, args);
            } catch (error) {
                self.logError('Function Error', {
                    function: fn.name || 'anonymous',
                    arguments: args,
                    error: error
                });
                showNotification('操作失败', 'error');
                return null;
            }
        };
    },

    wrapAsyncFunction: function(fn, context) {
        const self = this;
        return async function(...args) {
            try {
                return await fn.apply(context || this, args);
            } catch (error) {
                self.logError('Async Function Error', {
                    function: fn.name || 'anonymous',
                    arguments: args,
                    error: error
                });
                showNotification('操作失败', 'error');
                return null;
            }
        };
    }
};

export default ErrorHandler;
