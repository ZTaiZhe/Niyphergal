import { strictSanitize } from './securitySandbox.js';

export function initTrustedTypes() {
    if (!window.__NPHER_V2 || !window.__NPHER_V2.trustedTypes) {
        return;
    }

    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        window.npherSanitizerPolicy = window.trustedTypes.createPolicy('npher-policy', {
            createHTML: (string) => {
                return strictSanitize(string);
            },
            createScript: (string) => {
                console.error('[Security Alert] Dynamic script execution blocked.');
                return '';
            },
            createScriptURL: (string) => {
                const trustedOrigins = ['https://cdn.niyphergal.com/', 'https://unpkg.com/'];
                if (trustedOrigins.some(origin => string.startsWith(origin))) {
                    return string;
                }
                console.error(`[Security Alert] Untrusted Script URL blocked: ${string}`);
                return '';
            }
        });
    }
}
